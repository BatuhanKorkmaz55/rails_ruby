# Vardiya Yönetim Sistemi - Ödev Raporu

**Öğrenci Adı Soyadı:** Batuhan KORKMAZ  
**Öğrenci Numarası:** 201118016  

---

## 1. Proje Özeti

Bu proje, bir vardiya yönetim sistemi geliştirmek amacıyla oluşturulmuştur. Sistem, çalışanların vardiyalarını yönetmek, vardiya atamaları yapmak ve takvim görünümünde vardiyaları görüntülemek için tasarlanmıştır. Proje, modern web teknolojileri kullanılarak geliştirilmiş ve test odaklı bir yaklaşım benimsenmiştir.

### 1.1. Proje Amacı

- Çalışanların vardiyalarını yönetmek
- Departman bazlı vardiya organizasyonu yapmak
- Vardiya atamalarını takip etmek
- Takvim görünümünde vardiyaları görüntülemek
- RESTful API mimarisi ile backend-frontend ayrımı yapmak
- Test odaklı geliştirme (TDD/BDD) uygulamak

---

## 2. Kullanılan Teknolojiler

### 2.1. Backend Teknolojileri

- **Ruby on Rails 7.1**: API-only backend framework
- **SQLite3**: Geliştirme ortamı için veritabanı
- **RSpec**: Backend test framework
- **Factory Bot**: Test verisi oluşturma
- **Faker**: Sahte veri üretimi
- **Shoulda Matchers**: Model testleri için matcher'lar
- **Rack CORS**: Cross-Origin Resource Sharing desteği

### 2.2. Frontend Teknolojileri

- **Next.js 14**: React framework (App Router)
- **TypeScript**: Tip güvenliği
- **Axios**: HTTP istekleri
- **React Calendar**: Takvim bileşeni
- **date-fns**: Tarih işlemleri
- **Tailwind CSS**: Stil framework'ü

### 2.3. Test Teknolojileri

- **Cypress**: End-to-end test framework
- **Cucumber**: Behavior-Driven Development (BDD)
- **@badeball/cypress-cucumber-preprocessor**: Cypress-Cucumber entegrasyonu

---

## 3. Proje Yapısı

### 3.1. Backend Yapısı

```
rails_odev/
├── app/
│   ├── controllers/
│   │   └── api/v1/
│   │       ├── users_controller.rb
│   │       ├── departments_controller.rb
│   │       ├── shifts_controller.rb
│   │       └── shift_assignments_controller.rb
│   ├── models/
│   │   ├── user.rb
│   │   ├── department.rb
│   │   ├── shift.rb
│   │   └── shift_assignment.rb
│   └── ...
├── db/
│   ├── migrate/
│   └── seeds.rb
├── spec/
│   ├── requests/
│   │   └── api/v1/
│   ├── models/
│   └── factories/
└── config/
    ├── routes.rb
    └── initializers/
        └── cors.rb
```

### 3.2. Frontend Yapısı

```
frontend/
├── app/
│   ├── page.tsx (Ana sayfa)
│   └── globals.css
├── cypress/
│   ├── e2e/
│   │   └── shift_management.feature
│   └── support/
│       └── step_definitions/
│           └── shift_management.js
└── package.json
```

---

## 4. Veritabanı Yapısı

### 4.1. Modeller ve İlişkiler

**User (Çalışan)**
- `id`: Primary key
- `name`: İsim
- `email`: E-posta
- `bio`: Biyografi
- `role`: Rol (employee, manager, admin)
- `department_id`: Departman referansı

**Department (Departman)**
- `id`: Primary key
- `name`: Departman adı
- `description`: Açıklama

**Shift (Vardiya)**
- `id`: Primary key
- `date`: Tarih
- `start_time`: Başlangıç saati
- `end_time`: Bitiş saati
- `shift_type`: Vardiya tipi (morning, afternoon, night)
- `status`: Durum (scheduled, confirmed, cancelled)
- `department_id`: Departman referansı

**ShiftAssignment (Vardiya Ataması)**
- `id`: Primary key
- `user_id`: Çalışan referansı
- `shift_id`: Vardiya referansı
- `status`: Durum (assigned, confirmed, completed)
- `notes`: Notlar

### 4.2. İlişkiler

- User `belongs_to` Department (optional)
- User `has_many` ShiftAssignments
- User `has_many` Shifts (through ShiftAssignments)
- Department `has_many` Users
- Department `has_many` Shifts
- Shift `belongs_to` Department (optional)
- Shift `has_many` ShiftAssignments
- Shift `has_many` Users (through ShiftAssignments)
- ShiftAssignment `belongs_to` User
- ShiftAssignment `belongs_to` Shift

---

## 5. API Endpoints

### 5.1. Users API

- `GET /api/v1/users` - Tüm çalışanları listele
- `GET /api/v1/users/:id` - Çalışan detayı
- `POST /api/v1/users` - Yeni çalışan ekle
- `PATCH /api/v1/users/:id` - Çalışan güncelle
- `DELETE /api/v1/users/:id` - Çalışan sil

### 5.2. Departments API

- `GET /api/v1/departments` - Tüm departmanları listele
- `GET /api/v1/departments/:id` - Departman detayı
- `POST /api/v1/departments` - Yeni departman ekle
- `PATCH /api/v1/departments/:id` - Departman güncelle
- `DELETE /api/v1/departments/:id` - Departman sil

### 5.3. Shifts API

- `GET /api/v1/shifts` - Tüm vardiyaları listele (date, shift_type, department_id filtreleri ile)
- `GET /api/v1/shifts/:id` - Vardiya detayı
- `POST /api/v1/shifts` - Yeni vardiya ekle
- `PATCH /api/v1/shifts/:id` - Vardiya güncelle
- `DELETE /api/v1/shifts/:id` - Vardiya sil

### 5.4. ShiftAssignments API

- `GET /api/v1/shift_assignments` - Tüm atamaları listele (user_id, shift_id filtreleri ile)
- `GET /api/v1/shift_assignments/:id` - Atama detayı
- `POST /api/v1/shift_assignments` - Yeni atama yap
- `PATCH /api/v1/shift_assignments/:id` - Atama güncelle
- `DELETE /api/v1/shift_assignments/:id` - Atama sil

---

## 6. Frontend Özellikleri

### 6.1. Ana Sayfa Özellikleri

- **Takvim Görünümü**: React Calendar ile vardiyaları görüntüleme
- **Vardiya Listesi**: Seçilen tarihe göre vardiyaları listeleme
- **Çalışan Yönetimi**: Çalışan ekleme, silme ve listeleme
- **Vardiya Yönetimi**: Vardiya ekleme, silme ve listeleme
- **Atama Yönetimi**: Vardiya atama yapma ve silme
- **Tab Navigasyonu**: Takvim, Çalışanlar, Vardiyalar, Atamalar sekmeleri

### 6.2. Form Özellikleri

- **Çalışan Ekleme Formu**: İsim, e-posta, biyografi, rol, departman
- **Vardiya Ekleme Formu**: Tarih, başlangıç saati, bitiş saati, vardiya tipi, departman
- **Atama Formu**: Çalışan seçimi, vardiya seçimi, durum, notlar

---

## 7. Test Stratejisi

### 7.1. Backend Testleri (RSpec)

**Request Testleri:**
- Users API için CRUD testleri
- Departments API için CRUD testleri
- Shifts API için CRUD testleri (filtreleme dahil)
- ShiftAssignments API için CRUD testleri (filtreleme dahil)

**Model Testleri:**
- User model ilişkileri ve enum testleri
- Department model ilişkileri
- Shift model ilişkileri
- ShiftAssignment model ilişkileri

**Factory Testleri:**
- Tüm modeller için factory validasyonu

### 7.2. Frontend Testleri (Cypress + Cucumber)

**E2E Test Senaryoları:**
1. ✅ Vardiya yönetim sayfasını görüntüleme
2. ✅ Takvimde vardiyaları görüntüleme
3. ✅ Yeni vardiya ekleme
4. ✅ Çalışana vardiya atama
5. ✅ Çalışanlar sekmesini görüntüleme
6. ✅ Atamalar sekmesini görüntüleme
7. ✅ Çalışan silme
8. ✅ Atama silme

**Test Sonuçları:**
- Toplam 8 test senaryosu
- Tüm testler başarıyla geçmektedir
- BDD yaklaşımı ile Cucumber feature dosyaları kullanılmıştır

---

## 8. CORS Yapılandırması

Backend, frontend ile iletişim kurabilmek için CORS (Cross-Origin Resource Sharing) yapılandırması yapılmıştır:

```ruby
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'localhost:3001', '127.0.0.1:3001', 'localhost:5173'
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
```

---

## 9. Çalıştırma Talimatları

### 9.1. Backend Çalıştırma

```bash
# Bağımlılıkları yükle
bundle install

# Veritabanını oluştur ve migrate et
rails db:create db:migrate

# Seed verilerini yükle (opsiyonel)
rails db:seed

# Sunucuyu başlat
rails server
```

Backend `http://localhost:3000` adresinde çalışacaktır.

### 9.2. Frontend Çalıştırma

```bash
# Frontend klasörüne git
cd frontend

# Bağımlılıkları yükle
npm install

# Sunucuyu başlat
npm run dev -- -p 3001
```

Frontend `http://localhost:3001` adresinde çalışacaktır.

### 9.3. Test Çalıştırma

**Backend Testleri:**
```bash
# RSpec testlerini çalıştır
bundle exec rspec
```

**Frontend Testleri:**
```bash
# Cypress testlerini açık modda çalıştır
cd frontend
npm run cypress:open

# Cypress testlerini headless modda çalıştır
npm run cypress:run
```

---

## 10. Proje Geliştirme Süreci

### 10.1. Aşamalar

1. **Backend Geliştirme**: Rails API-only projesi oluşturuldu, modeller ve controller'lar yazıldı
2. **Test Altyapısı**: RSpec, Factory Bot, Faker kuruldu ve testler yazıldı
3. **Frontend Geliştirme**: Next.js projesi oluşturuldu, ana sayfa ve formlar geliştirildi
4. **E2E Testleri**: Cypress + Cucumber ile BDD testleri yazıldı
5. **CORS Yapılandırması**: Backend-frontend iletişimi sağlandı
6. **UI İyileştirmeleri**: Takvim görünümü, formlar ve stil iyileştirmeleri yapıldı

### 10.2. Karşılaşılan Zorluklar ve Çözümler

- **CORS Sorunları**: CORS yapılandırması ile çözüldü
- **Test Flakiness**: Bekleme süreleri ve doğru selector'lar ile çözüldü
- **Veri Yükleme**: API çağrılarının tamamlanmasını beklemek için uygun wait stratejileri kullanıldı
- **Modal Overlay Sorunları**: `force: true` parametresi ile çözüldü

---

## 11. Sonuç ve Değerlendirme

Bu proje, modern web geliştirme teknolojileri kullanılarak başarıyla tamamlanmıştır. RESTful API mimarisi ile backend-frontend ayrımı yapılmış, test odaklı geliştirme yaklaşımı benimsenmiştir. 

### 11.1. Başarılar

- ✅ RESTful API tasarımı
- ✅ Test odaklı geliştirme (TDD/BDD)
- ✅ Modern frontend teknolojileri kullanımı
- ✅ Responsive ve kullanıcı dostu arayüz
- ✅ Kapsamlı test kapsamı

### 11.2. Gelecek İyileştirmeler

- Authentication ve authorization eklenebilir
- Real-time bildirimler eklenebilir
- Raporlama özellikleri eklenebilir
- Mobil uygulama geliştirilebilir
- Performans optimizasyonları yapılabilir

---

## 12. Kaynaklar

- [Ruby on Rails Documentation](https://guides.rubyonrails.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Cypress Documentation](https://docs.cypress.io/)
- [RSpec Documentation](https://rspec.info/)
- [Cucumber Documentation](https://cucumber.io/docs)

---

**Rapor Hazırlayan:** Batuhan KORKMAZ  
**Öğrenci No:** 201118016  
**Tarih:** 2024

