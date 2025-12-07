from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from datetime import datetime
import json

app = FastAPI(title="BlogX API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

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

# API Routes
@app.get("/")
async def root():
    return {"message": "BlogX API is running!"}

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