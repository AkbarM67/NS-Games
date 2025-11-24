# NS Topup API Documentation

## Authentication
Semua endpoint yang memerlukan autentikasi menggunakan Bearer Token di header:
```
Authorization: Bearer {token}
```

## Auth Endpoints

### Register
- **POST** `/api/register`
- Body: `name`, `email`, `password`, `password_confirmation`

### Login
- **POST** `/api/login`
- Body: `email`, `password`

### Logout
- **POST** `/api/logout` (Auth required)

### Get User Info
- **GET** `/api/me` (Auth required)

## Customer Endpoints

### Profile
- **GET** `/api/customer/profile` - Lihat profil
- **PUT** `/api/customer/profile` - Edit profil
- **PUT** `/api/customer/profile/password` - Ganti password

### Games & Products
- **GET** `/api/games` - Lihat semua game (public)
- **GET** `/api/games/{id}` - Detail game dengan paket (public)
- **GET** `/api/customer/games` - Lihat game (auth)
- **GET** `/api/customer/games/{id}` - Detail game (auth)

### Orders
- **GET** `/api/customer/orders` - History pemesanan
- **POST** `/api/customer/orders` - Buat order baru
- **GET** `/api/customer/orders/{id}` - Detail order
- **POST** `/api/customer/orders/{id}/payment-proof` - Upload bukti bayar

## Admin Endpoints (Auth + Admin role required)

### Dashboard
- **GET** `/api/admin/dashboard` - Data dashboard & statistik

### Orders Management
- **GET** `/api/admin/orders` - Lihat semua order
- **GET** `/api/admin/orders/{id}` - Detail order
- **PUT** `/api/admin/orders/{id}/status` - Update status order

### Games Management
- **GET** `/api/admin/games` - List games
- **POST** `/api/admin/games` - Tambah game
- **GET** `/api/admin/games/{id}` - Detail game
- **PUT** `/api/admin/games/{id}` - Update game
- **DELETE** `/api/admin/games/{id}` - Hapus game

### Products Management
- **GET** `/api/admin/products` - List products
- **POST** `/api/admin/products` - Tambah product
- **GET** `/api/admin/products/{id}` - Detail product
- **PUT** `/api/admin/products/{id}` - Update product
- **DELETE** `/api/admin/products/{id}` - Hapus product

### Payment Methods Management
- **GET** `/api/admin/payment-methods` - List payment methods
- **POST** `/api/admin/payment-methods` - Tambah payment method
- **GET** `/api/admin/payment-methods/{id}` - Detail payment method
- **PUT** `/api/admin/payment-methods/{id}` - Update payment method
- **DELETE** `/api/admin/payment-methods/{id}` - Hapus payment method

### Customers Management
- **GET** `/api/admin/customers` - List customers
- **GET** `/api/admin/customers/{id}` - Detail customer

### Activity Logs
- **GET** `/api/admin/activity-logs` - Riwayat aktivitas admin

## Default Login Credentials
- **Admin**: admin@example.com / password
- **Customer**: customer@example.com / password

## Order Status Flow
1. `waiting_payment` - Menunggu pembayaran
2. `pending` - Bukti bayar sudah diupload, menunggu verifikasi
3. `processing` - Sedang diproses
4. `success` - Berhasil
5. `failed` - Gagal

## File Upload
- Avatar: max 2MB, format: jpeg,png,jpg
- Game/Payment Method Icons: max 2MB, format: jpeg,png,jpg  
- Payment Proof: max 5MB, format: jpeg,png,jpg
