# 🎓 Rails + Next.js BDD Uygulaması

Bu proje Ruby on Rails (API-only) ve Next.js 14 kullanılarak geliştirilmiş basit bir **User Profile** senaryosudur.  
Proje, Test Driven Development (TDD) ve Behavior Driven Development (BDD) yaklaşımlarını birleştirir.

---

## 🧱 Backend (Ruby on Rails API)

- Rails 7.1.5.2, Ruby 3.3.0
- Endpoint: `/api/v1/users/:id`
- CORS aktif (localhost:3001 erişimine izin verir)
- Test Framework: **RSpec**
- Test Kapsamı:
  - User API endpoint testi
  - Factory Bot + Faker ile test verisi
  - Shoulda Matchers ile model doğrulamaları

---

## 💻 Frontend (Next.js)

- Next.js 14 (App Router)
- API entegrasyonu: Axios ile `/api/v1/users/1` çağrısı
- Kullanıcı bilgileri (Name, Email, Bio) gösterimi
- Port: `3001`

---

## 🧪 Testler (BDD)

- Test Aracı: **Cypress + Cucumber**
- Feature: `User profile page`
- Senaryo:
  - "Kullanıcı ana sayfaya gittiğinde User Profile başlığını görür."
- Komutlar:
  ```bash
  cd frontend
  npm run cypress:open
  ```

---

## ⚙️ Çalıştırma Adımları

### 1️⃣ Backend'i başlat
```bash
rails s
```

### 2️⃣ Frontend'i başlat
```bash
cd frontend
npm run dev -- -p 3001
```

### 3️⃣ Tarayıcıdan görüntüle
👉 http://localhost:3001

---

## 🎥 Demo Video

Demo Video Linki (YouTube)

---

## 👥 Katkıda Bulunanlar

- Batuhan Korkmaz
- Nurettin Şenyer
- Ömer Durmuş

---

## 🧩 Teknolojiler

| Alan | Teknoloji |
|------|-----------|
| Backend | Ruby on Rails |
| Frontend | Next.js |
| Test (Backend) | RSpec |
| Test (Frontend) | Cypress + Cucumber |
| Veritabanı | SQLite3 |
| Entegrasyon | CORS |

---

## 🧾 Lisans

Bu proje eğitim amaçlıdır. Etik ihlali olmaması adına katkıda bulunanlar belirtilmiştir.

---

## 🧭 Repo Bilgisi

**GitHub Repo:** https://github.com/BatuhanKorkmaz55/rails_ruby.git

---

## 📝 Proje Yapısı

```
rails_odev/
├── app/                    # Rails backend
│   ├── controllers/
│   │   └── api/v1/        # API endpoints
│   ├── models/            # Active Record models
│   └── ...
├── frontend/               # Next.js frontend
│   ├── app/               # Next.js App Router
│   ├── cypress/           # E2E tests (Cypress + Cucumber)
│   └── ...
├── spec/                   # RSpec tests
└── ...
```

---

## 🔧 Geliştirme

### Backend Testleri
```bash
bundle exec rspec
```

### Frontend Testleri
```bash
cd frontend
npm run cypress:open
```

### Veritabanı Migration
```bash
rails db:migrate
```

---

## 📚 Ek Kaynaklar

- [Rails API Documentation](https://guides.rubyonrails.org/api_app.html)
- [Next.js Documentation](https://nextjs.org/docs)
- [RSpec Documentation](https://rspec.info/)
- [Cypress Documentation](https://docs.cypress.io/)

---

**Commit Mesajı:** `docs: update README for GitHub submission (project overview, usage, contributors)`
