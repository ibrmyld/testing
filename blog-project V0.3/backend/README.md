# BlogX Backend API

FastAPI tabanlı blog backend servisi.

## Kurulum

1. Sanal ortam oluştur:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
```

2. Paketleri yükle:
```bash
pip install -r requirements.txt
```

3. Servisi başlat:
```bash
python main.py
```

## API Endpoints

- `GET /` - API status kontrolü
- `GET /api/posts` - Tüm blog yazıları
- `GET /api/posts/{slug}` - Tekil blog yazısı
- `GET /api/categories` - Kategoriler
- `POST /api/posts/{post_id}/comments` - Yorum ekleme
- `POST /api/newsletter` - Newsletter aboneliği
- `GET /api/stats` - Blog istatistikleri

## Geliştirme

FastAPI otomatik dokümantasyon:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc 