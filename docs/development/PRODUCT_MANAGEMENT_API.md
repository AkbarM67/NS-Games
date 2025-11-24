# 📦 PRODUCT MANAGEMENT API - NS TOPUP

## 🔗 **SWAGGER DOCUMENTATION**
Akses dokumentasi lengkap di: `http://localhost:8000/api/documentation`

## 🎯 **ENDPOINT MANAJEMEN PRODUK**

### **🎮 GAMES MANAGEMENT**

#### **GET /api/admin/games**
- **Deskripsi**: List semua games
- **Auth**: Bearer Token (Admin)
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Mobile Legends",
      "category": "MOBA",
      "description": "MOBA game populer",
      "image": "https://example.com/image.jpg",
      "is_active": true,
      "topup_products": [...]
    }
  ]
}
```

#### **POST /api/admin/games**
- **Deskripsi**: Tambah game baru
- **Auth**: Bearer Token (Admin)
- **Body**:
```json
{
  "name": "Mobile Legends",
  "category": "MOBA",
  "description": "MOBA game populer",
  "image": "https://example.com/image.jpg",
  "is_active": true
}
```

#### **PUT /api/admin/games/{id}**
- **Deskripsi**: Update game
- **Auth**: Bearer Token (Admin)

#### **DELETE /api/admin/games/{id}**
- **Deskripsi**: Hapus game
- **Auth**: Bearer Token (Admin)

### **📦 PRODUCTS MANAGEMENT**

#### **GET /api/admin/products**
- **Deskripsi**: List semua produk untuk admin
- **Auth**: Bearer Token (Admin)
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "1_1",
      "name": "Mobile Legends - 86 Diamonds",
      "category": "Game",
      "provider": "Digiflazz",
      "buyPrice": 20000,
      "sellPrice": 22000,
      "profit": 2000,
      "status": "active",
      "stock": "unlimited",
      "soldToday": 5
    }
  ]
}
```

#### **POST /api/admin/products**
- **Deskripsi**: Tambah produk baru
- **Auth**: Bearer Token (Admin)
- **Body**:
```json
{
  "game_id": 1,
  "product_name": "86 Diamonds",
  "amount": 86,
  "price": 22000,
  "base_price": 20000,
  "sku_code": "ML_86"
}
```

#### **GET /api/admin/products/{id}**
- **Deskripsi**: Detail produk
- **Auth**: Bearer Token (Admin)

#### **PUT /api/admin/products/{id}**
- **Deskripsi**: Update produk
- **Auth**: Bearer Token (Admin)
- **Body**:
```json
{
  "product_name": "86 Diamonds",
  "amount": 86,
  "price": 22000,
  "base_price": 20000
}
```

#### **DELETE /api/admin/products/{id}**
- **Deskripsi**: Hapus produk
- **Auth**: Bearer Token (Admin)

## 🔐 **AUTHENTICATION**

Semua endpoint admin memerlukan:
```
Authorization: Bearer {token}
```

Token didapat dari login admin:
```bash
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "password"
}
```

## 📊 **CONTOH PENGGUNAAN**

### **1. Login Admin**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

### **2. Get All Products**
```bash
curl -X GET http://localhost:8000/api/admin/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **3. Create New Product**
```bash
curl -X POST http://localhost:8000/api/admin/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "game_id": 1,
    "product_name": "172 Diamonds",
    "amount": 172,
    "price": 43000,
    "base_price": 40000,
    "sku_code": "ML_172"
  }'
```

### **4. Update Product**
```bash
curl -X PUT http://localhost:8000/api/admin/products/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 45000,
    "base_price": 42000
  }'
```

## ✅ **STATUS CODES**

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden (Not Admin)
- `404` - Not Found
- `422` - Validation Error

## 🎯 **FRONTEND INTEGRATION**

Frontend Admin sudah terintegrasi dengan endpoint ini:
- **ProductManagement.tsx** menggunakan `/api/admin/products`
- **Data real** dari database, bukan dummy
- **CRUD operations** lengkap

## 🚀 **TESTING**

1. **Swagger UI**: `http://localhost:8000/api/documentation`
2. **Postman Collection**: Import dari Swagger
3. **Frontend Admin**: Langsung test di UI

**Semua endpoint manajemen produk sudah masuk Swagger! 🎉**