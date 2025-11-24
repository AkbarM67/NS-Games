# NS Topup API Documentation (Updated)

## Base URL
```
http://localhost:8000/api
```

## Authentication
Semua endpoint yang memerlukan autentikasi menggunakan Bearer Token di header:
```
Authorization: Bearer {token}
```

## Response Format
Semua response menggunakan format JSON dengan struktur:
```json
{
  "success": true|false,
  "data": {},
  "message": "string"
}
```

## Auth Endpoints

### Register
- **POST** `/auth/register`
- **Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "password_confirmation": "string"
}
```

### Login
- **POST** `/auth/login`
- **Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "role": "customer"
  },
  "token": "1|abcdef123456..."
}
```

### Logout
- **POST** `/auth/logout` (Auth required)

### Get User Info
- **GET** `/user` (Auth required)

## Public Endpoints

### Games
- **GET** `/games` - List semua game dengan produk
- **Response:**
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
      "products": [
        {
          "id": 1,
          "name": "86 Diamonds",
          "price": "22000.00",
          "sku_code": "ML_86"
        }
      ]
    }
  ]
}
```

### Game Products
- **GET** `/customer/games/{gameId}/products` - Produk untuk game tertentu

## Customer Endpoints (Auth Required)

### Orders
- **GET** `/customer/orders` - History pemesanan
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "game_name": "Mobile Legends",
      "product_name": "86 Diamonds",
      "player_id": "123456789",
      "server_id": "2001",
      "amount": 86,
      "total_price": "22000.00",
      "status": "success",
      "payment_method": "BCA",
      "created_at": "2025-01-21T10:00:00.000000Z",
      "product": {
        "id": 1,
        "product_name": "86 Diamonds",
        "game": {
          "id": 1,
          "name": "Mobile Legends"
        }
      }
    }
  ]
}
```

- **POST** `/customer/orders` - Buat order baru
- **Body:**
```json
{
  "product_id": 1,
  "player_id": "123456789",
  "server_id": "2001",
  "payment_method": "BCA"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "status": "waiting_payment",
    "total_price": "22000.00"
  }
}
```

- **GET** `/customer/orders/{id}` - Detail order

## Admin Endpoints (Auth + Admin role required)

### Dashboard
- **GET** `/dashboard` - Data dashboard & statistik

### Orders Management
- **GET** `/orders` - List semua order dengan filter
- **GET** `/orders/{id}` - Detail order
- **PATCH** `/orders/{id}/status` - Update status order
- **Body:**
```json
{
  "status": "success|failed|processing|pending"
}
```

### Customers Management
- **GET** `/customers` - List customers
- **PATCH** `/customers/{id}/block` - Block/unblock customer

## Order Status Flow
1. `waiting_payment` - Menunggu pembayaran
2. `pending` - Bukti bayar sudah diupload, menunggu verifikasi
3. `processing` - Sedang diproses
4. `success` - Berhasil
5. `failed` - Gagal

## Error Responses
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field": ["Validation error"]
  }
}
```

## Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

## Default Login Credentials
- **Admin**: admin@example.com / password
- **Customer**: customer@example.com / password