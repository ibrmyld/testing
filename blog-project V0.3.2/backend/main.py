from fastapi import FastAPI, HTTPException, Depends, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import uvicorn
from datetime import datetime, timedelta
import json
import os
import shutil
from passlib.context import CryptContext # type: ignore
from jose import JWTError, jwt

app = FastAPI(title="BlogX API", version="1.0.0")

# Create uploads directory if it doesn't exist
os.makedirs("uploads", exist_ok=True)

# Static files for uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
SECRET_KEY = "your-secret-key-here-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

security = HTTPBearer()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Pydantic models
class BlogPost(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: str
    content: str
    author: str
    publishedAt: str
    readTime: str
    category: str
    tags: List[str]
    image: str
    views: int
    comments: List[dict] = []

class Comment(BaseModel):
    id: int
    author: str
    content: str
    publishedAt: str

class Newsletter(BaseModel):
    email: str

class User(BaseModel):
    id: int
    email: EmailStr
    firstName: str
    lastName: str
    phone: Optional[str] = None
    avatar: Optional[str] = None
    joinDate: str
    isActive: bool = True

class UserCreate(BaseModel):
    email: EmailStr
    firstName: str
    lastName: str
    password: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserUpdate(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    phone: Optional[str] = None

class PasswordChange(BaseModel):
    currentPassword: str
    newPassword: str

class FavoriteToggle(BaseModel):
    post_id: int

# Sample data (in production, use database)
blog_posts = [
    {
        "id": 1,
        "title": "Building the Future with AI",
        "slug": "building-future-with-ai",
        "excerpt": "Exploring how artificial intelligence is reshaping the way we build software and create digital experiences.",
        "content": "# Building the Future with AI\n\nArtificial Intelligence is no longer a distant dream—it's here, and it's transforming everything we know about software development.\n\n## The Revolution is Now\n\nFrom code generation to automated testing, AI is becoming an integral part of the development workflow.",
        "author": "Tech Explorer",
        "publishedAt": "2024-01-15",
        "readTime": "5 min read",
        "category": "Technology",
        "tags": ["AI", "Development", "Future"],
        "image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
        "views": 1250,
        "comments": []
    },
    {
        "id": 2,
        "title": "Modern Web Development Best Practices",
        "slug": "modern-web-development-best-practices",
        "excerpt": "Essential practices every web developer should follow in 2024 to build scalable and maintainable applications.",
        "content": "# Modern Web Development Best Practices\n\nWeb development has evolved significantly over the past few years. Here are the essential practices you should follow in 2024.",
        "author": "Code Master",
        "publishedAt": "2024-01-12",
        "readTime": "8 min read",
        "category": "Web Development",
        "tags": ["Best Practices", "Performance", "Security"],
        "image": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
        "views": 890,
        "comments": []
    }
]

categories = ["All", "Technology", "Web Development", "3D Graphics", "Cybersecurity", "AI & Machine Learning"]
newsletter_subscribers = []

# Favorites database (in production, use real database)
favorites_file = "favorites.json"

def load_favorites():
    try:
        with open(favorites_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def save_favorites(favorites_data):
    with open(favorites_file, 'w', encoding='utf-8') as f:
        json.dump(favorites_data, f, ensure_ascii=False, indent=2)

user_favorites = load_favorites()

# Sample users database (in production, use real database)
# JSON dosyasından kullanıcı verilerini yükle
users_file = "users.json"

def load_users():
    try:
        with open(users_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        # İlk çalıştırmada dosya yoksa demo kullanıcı oluştur
        initial_users = {
            "demo@blogx.com": {
                "id": 1,
                "email": "demo@blogx.com",
                "firstName": "Demo",
                "lastName": "User",
                "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # secret
                "phone": "+90 555 123 45 67",
                "avatar": None,
                "joinDate": "2024-01-01T00:00:00",
                "isActive": True
            }
        }
        save_users(initial_users)
        return initial_users

def save_users(users_data):
    with open(users_file, 'w', encoding='utf-8') as f:
        json.dump(users_data, f, ensure_ascii=False, indent=2)

fake_users_db = load_users()

# Auth helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(email: str):
    if email in fake_users_db:
        user_dict = fake_users_db[email]
        return User(**user_dict)

def authenticate_user(email: str, password: str):
    user = fake_users_db.get(email)
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = get_user(email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

# API Routes
@app.get("/")
async def root():
    return {"message": "BlogX API is running!"}

# Authentication endpoints
@app.post("/api/auth/register", response_model=dict)
async def register_user(user: UserCreate):
    """Register new user"""
    if user.email in fake_users_db:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    hashed_password = get_password_hash(user.password)
    user_id = len(fake_users_db) + 1
    
    new_user = {
        "id": user_id,
        "email": user.email,
        "firstName": user.firstName,
        "lastName": user.lastName,
        "hashed_password": hashed_password,
        "phone": user.phone,
        "avatar": None,
        "joinDate": datetime.now().isoformat(),
        "isActive": True
    }
    
    fake_users_db[user.email] = new_user
    save_users(fake_users_db)  # JSON dosyasına kaydet
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {
        "message": "User registered successfully",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": user.email,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "phone": user.phone,
            "avatar": None,
            "joinDate": datetime.now().isoformat()
        }
    }

@app.post("/api/auth/login", response_model=dict)
async def login_user(user: UserLogin):
    """Login user"""
    print(f"Login attempt for: {user.email}")
    user_data = authenticate_user(user.email, user.password)
    if not user_data:
        print(f"Failed login for: {user.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(f"Successful login for: {user.email}")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_data["id"],
            "email": user_data["email"],
            "firstName": user_data["firstName"],
            "lastName": user_data["lastName"],
            "phone": user_data["phone"],
            "avatar": user_data["avatar"],
            "joinDate": user_data["joinDate"]
        }
    }

@app.get("/api/auth/me", response_model=dict)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "firstName": current_user.firstName,
        "lastName": current_user.lastName,
        "phone": current_user.phone,
        "avatar": current_user.avatar,
        "joinDate": current_user.joinDate
    }

@app.put("/api/auth/profile", response_model=dict)
async def update_profile(user_update: UserUpdate, current_user: User = Depends(get_current_user)):
    """Update user profile"""
    print(f"Profile update request for: {current_user.email}")
    
    # Email değişirse, mevcut kullanıcı kontrolü
    if user_update.email != current_user.email:
        if user_update.email in fake_users_db:
            raise HTTPException(
                status_code=400,
                detail="Bu e-posta adresi zaten kullanılıyor"
            )
    
    # Mevcut kullanıcıyı güncelle
    old_email = current_user.email
    fake_users_db[old_email].update({
        "firstName": user_update.firstName,
        "lastName": user_update.lastName,
        "email": user_update.email,
        "phone": user_update.phone
    })
    
    # Email değiştiyse, eski key'i sil ve yeni key ile kaydet
    if user_update.email != old_email:
        user_data = fake_users_db.pop(old_email)
        fake_users_db[user_update.email] = user_data
    
    # JSON dosyasını güncelle
    save_users(fake_users_db)
    
    print(f"Profile updated successfully for: {user_update.email}")
    
    return {
        "message": "Profil başarıyla güncellendi",
        "user": {
            "id": current_user.id,
            "email": user_update.email,
            "firstName": user_update.firstName,
            "lastName": user_update.lastName,
            "phone": user_update.phone,
            "avatar": current_user.avatar,
            "joinDate": current_user.joinDate
        }
    }

@app.put("/api/auth/change-password", response_model=dict)
async def change_password(password_change: PasswordChange, current_user: User = Depends(get_current_user)):
    """Change user password"""
    print(f"Password change request for: {current_user.email}")
    
    # Mevcut şifreyi kontrol et
    if not verify_password(password_change.currentPassword, fake_users_db[current_user.email]["hashed_password"]):
        raise HTTPException(
            status_code=400,
            detail="Mevcut şifre yanlış"
        )
    
    # Yeni şifreyi hashle
    new_hashed_password = get_password_hash(password_change.newPassword)
    
    # Şifreyi güncelle
    fake_users_db[current_user.email]["hashed_password"] = new_hashed_password
    
    # JSON dosyasını güncelle
    save_users(fake_users_db)
    
    print(f"Password changed successfully for: {current_user.email}")
    
    return {"message": "Şifre başarıyla değiştirildi"}

@app.post("/api/auth/upload-avatar", response_model=dict)
async def upload_avatar(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    """Upload user avatar"""
    print(f"Avatar upload request for: {current_user.email}")
    
    # File type kontrolü
    allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Sadece JPEG, PNG, GIF ve WebP formatları desteklenir"
        )
    
    # File size kontrolü (5MB max)
    max_size = 5 * 1024 * 1024  # 5MB
    file_content = await file.read()
    if len(file_content) > max_size:
        raise HTTPException(
            status_code=400,
            detail="Dosya boyutu 5MB'dan büyük olamaz"
        )
    
    # Unique filename oluştur
    file_extension = file.filename.split('.')[-1]
    unique_filename = f"avatar_{current_user.id}_{int(datetime.now().timestamp())}.{file_extension}"
    file_path = f"uploads/{unique_filename}"
    
    # Dosyayı kaydet
    with open(file_path, "wb") as buffer:
        buffer.write(file_content)
    
    # Avatar URL'ini oluştur
    avatar_url = f"http://localhost:8000/uploads/{unique_filename}"
    
    # Kullanıcı veritabanında avatar'ı güncelle
    fake_users_db[current_user.email]["avatar"] = avatar_url
    save_users(fake_users_db)
    
    print(f"Avatar uploaded successfully for: {current_user.email}")
    
    return {
        "message": "Avatar başarıyla yüklendi",
        "avatar_url": avatar_url
    }

@app.post("/api/favorites/toggle", response_model=dict)
async def toggle_favorite(favorite: FavoriteToggle, current_user: User = Depends(get_current_user)):
    """Toggle favorite status for a blog post"""
    user_email = current_user.email
    post_id = favorite.post_id
    
    print(f"Toggle favorite request - User: {user_email}, Post ID: {post_id}")
    print(f"Current user_favorites: {user_favorites}")
    
    # Kullanıcının favori listesi yoksa oluştur
    if user_email not in user_favorites:
        user_favorites[user_email] = []
        print(f"Created new favorites list for user: {user_email}")
    
    # Post zaten favorilerde mi kontrol et
    if post_id in user_favorites[user_email]:
        # Favorilerden çıkar
        user_favorites[user_email].remove(post_id)
        is_favorite = False
        message = "Yazı favorilerden çıkarıldı"
        print(f"Removed post {post_id} from favorites")
    else:
        # Favorilere ekle
        user_favorites[user_email].append(post_id)
        is_favorite = True
        message = "Yazı favorilere eklendi"
        print(f"Added post {post_id} to favorites")
    
    print(f"Updated user_favorites: {user_favorites}")
    
    # Dosyaya kaydet
    save_favorites(user_favorites)
    print("Favorites saved to file")
    
    return {
        "message": message,
        "is_favorite": is_favorite,
        "post_id": post_id
    }

@app.get("/api/favorites", response_model=List[BlogPost])
async def get_user_favorites(current_user: User = Depends(get_current_user)):
    """Get user's favorite blog posts"""
    user_email = current_user.email
    
    if user_email not in user_favorites:
        return []
    
    # Kullanıcının favori post ID'lerini al
    favorite_post_ids = user_favorites[user_email]
    
    # Favori postları filtrele
    favorite_posts = [post for post in blog_posts if post["id"] in favorite_post_ids]
    
    return favorite_posts

@app.get("/api/favorites/check/{post_id}", response_model=dict)
async def check_favorite_status(post_id: int, current_user: User = Depends(get_current_user)):
    """Check if a post is in user's favorites"""
    user_email = current_user.email
    
    print(f"Check favorite status - User: {user_email}, Post ID: {post_id}")
    print(f"Current user_favorites: {user_favorites}")
    
    if user_email not in user_favorites:
        is_favorite = False
        print(f"User {user_email} has no favorites list")
    else:
        is_favorite = post_id in user_favorites[user_email]
        print(f"Is post {post_id} favorite for {user_email}: {is_favorite}")
        print(f"User's favorites: {user_favorites[user_email]}")
    
    return {
        "post_id": post_id,
        "is_favorite": is_favorite
    }

@app.get("/api/posts", response_model=List[BlogPost])
async def get_posts(category: Optional[str] = None, search: Optional[str] = None):
    """Get all blog posts with optional filtering"""
    posts = blog_posts.copy()
    
    if category and category != "All":
        posts = [post for post in posts if post["category"] == category]
    
    if search:
        posts = [post for post in posts if 
                search.lower() in post["title"].lower() or 
                search.lower() in post["excerpt"].lower()]
    
    return posts

@app.get("/api/posts/{slug}", response_model=BlogPost)
async def get_post(slug: str):
    """Get a specific blog post by slug"""
    post = next((post for post in blog_posts if post["slug"] == slug), None)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Increment views
    post["views"] += 1
    return post

@app.get("/api/categories")
async def get_categories():
    """Get all categories"""
    return {"categories": categories}

@app.post("/api/posts/{post_id}/comments")
async def add_comment(post_id: int, comment: dict):
    """Add a comment to a blog post"""
    post = next((post for post in blog_posts if post["id"] == post_id), None)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    new_comment = {
        "id": len(post["comments"]) + 1,
        "author": comment["author"],
        "content": comment["content"],
        "publishedAt": datetime.now().strftime("%Y-%m-%d")
    }
    
    post["comments"].append(new_comment)
    return {"message": "Comment added successfully", "comment": new_comment}

@app.post("/api/newsletter")
async def subscribe_newsletter(newsletter: Newsletter):
    """Subscribe to newsletter"""
    if newsletter.email in newsletter_subscribers:
        raise HTTPException(status_code=400, detail="Email already subscribed")
    
    newsletter_subscribers.append(newsletter.email)
    return {"message": "Successfully subscribed to newsletter"}

@app.get("/api/stats")
async def get_stats():
    """Get blog statistics"""
    total_posts = len(blog_posts)
    total_views = sum(post["views"] for post in blog_posts)
    total_comments = sum(len(post["comments"]) for post in blog_posts)
    
    return {
        "total_posts": total_posts,
        "total_views": total_views,
        "total_comments": total_comments,
        "newsletter_subscribers": len(newsletter_subscribers)
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 