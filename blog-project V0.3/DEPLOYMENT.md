# 🚀 BlogX Deployment Guide

## 📋 Deployment Seçenekleri

### Frontend: Vercel
### Backend: Railway / Render

---

## 🎯 1. Frontend (Vercel) Deploy

### Adım 1: GitHub'a Push
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Adım 2: Vercel'e Deploy
1. [Vercel.com](https://vercel.com)'a git
2. GitHub ile giriş yap
3. "New Project" tıkla
4. Repository'yi seç: `blog-project`
5. Build ayarları:
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (varsayılan)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Adım 3: Environment Variables
Vercel dashboard'da:
```
VITE_API_URL = https://your-backend-url.railway.app/api
```

---

## ⚡ 2. Backend (Railway) Deploy

### Adım 1: Railway Hesabı
1. [Railway.app](https://railway.app)'e git
2. GitHub ile giriş yap

### Adım 2: Yeni Proje
1. "New Project" → "Deploy from GitHub repo"
2. Repository seç ve `backend` klasörünü seç
3. Otomatik deploy başlar

### Adım 3: Domain Al
- Railway dashboard'da domain al
- URL'yi Vercel environment variable'ına ekle

---

## 🔧 3. Backend (Render) Deploy (Alternatif)

### Adım 1: Render Hesabı
1. [Render.com](https://render.com)'e git
2. GitHub ile giriş yap

### Adım 2: Web Service Oluştur
1. "New" → "Web Service"
2. Repository bağla
3. Ayarlar:
   - **Name:** blogx-backend
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Auto-Deploy:** Yes

---

## 🛠 4. Local Development

### Frontend:
```bash
cd blog-project
npm install
npm run dev
# http://localhost:5173
```

### Backend:
```bash
cd blog-project/backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python main.py
# http://localhost:8000
```

---

## 🌐 5. Production URLs

- **Frontend:** https://your-project.vercel.app
- **Backend:** https://your-backend.railway.app
- **API Docs:** https://your-backend.railway.app/docs

---

## 🔐 6. Environment Variables

### Frontend (.env.local):
```
VITE_API_URL=https://your-backend-url.railway.app/api
```

### Backend:
```
PORT=8000 (Railway/Render otomatik set eder)
PYTHONPATH=/app
```

---

## 📝 7. Deploy Checklist

### Frontend:
- [ ] Build çalışıyor (`npm run build`)
- [ ] Environment variables set
- [ ] Vercel domain aldınız
- [ ] API URL güncellendi

### Backend:
- [ ] Requirements.txt güncel
- [ ] CORS ayarları doğru
- [ ] Health endpoint çalışıyor
- [ ] Railway/Render deploy başarılı

### Integration:
- [ ] Frontend backend'e bağlanıyor
- [ ] API çağrıları çalışıyor
- [ ] CORS problemi yok
- [ ] SSL sertifikaları aktif

---

## 🐛 8. Troubleshooting

### CORS Hatası:
```python
# backend/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Build Hatası:
```bash
# Dependencies kontrol et
npm install
npm run build
```

### API Bağlantı Hatası:
- Backend URL'yi kontrol et
- Network sekmesinde 404/500 hatalarını kontrol et
- Environment variables doğru mu?

---

## 🎉 Deploy Tamamlandı!

Frontend ve backend ayrı sunucularda çalışıyor:
- ✅ Scalable architecture
- ✅ Independent deployments  
- ✅ Better performance
- ✅ Easier debugging 