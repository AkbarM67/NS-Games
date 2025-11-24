# 🚀 Setup Guide: Laravel Backend + React Frontend

## Prerequisites
- PHP 8.1+
- Composer
- MySQL/PostgreSQL
- Node.js 18+
- npm/yarn

---

## 📦 Backend Setup (Laravel)

### 1. Install Laravel
```bash
composer create-project laravel/laravel topup-backend
cd topup-backend
```

### 2. Install Laravel Sanctum (untuk authentication)
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 3. Setup Database
Edit `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=topup_store
DB_USERNAME=root
DB_PASSWORD=your_password
```

Create database:
```bash
mysql -u root -p
CREATE DATABASE topup_store;
```

### 4. Copy Migration Files
Copy all migration files dari `/laravel-setup/migrations/` ke `database/migrations/`

### 5. Copy Models
Copy semua files dari `/laravel-setup/Models/` ke `app/Models/`

### 6. Copy Controllers
Copy semua files dari `/laravel-setup/Controllers/API/` ke `app/Http/Controllers/API/`

### 7. Copy Routes
Replace `routes/api.php` dengan file dari `/laravel-setup/routes/api.php`

### 8. Setup CORS
Replace `config/cors.php` dengan file dari `/laravel-setup/config/cors.php`

Edit `.env` tambahkan:
```env
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:5173
SESSION_DOMAIN=localhost
FRONTEND_URL=http://localhost:5173
```

### 9. Run Migrations
```bash
php artisan migrate
```

### 10. Create Admin User (Optional)
```bash
php artisan tinker
```

Dalam tinker:
```php
$user = new App\Models\User();
$user->name = 'Admin';
$user->email = 'admin@topup.com';
$user->password = bcrypt('password');
$user->is_admin = true;
$user->save();
```

### 11. Run Laravel Server
```bash
php artisan serve
# Laravel will run on http://localhost:8000
```

---

## ⚛️ Frontend Setup (React)

### 1. Install Dependencies
```bash
npm install axios
# or
yarn add axios
```

### 2. Install React Query (Recommended)
```bash
npm install @tanstack/react-query
# or
yarn add @tanstack/react-query
```

### 3. Setup Environment Variables
Create `.env` file:
```env
VITE_API_URL=http://localhost:8000/api
```

### 4. Copy API Client
Copy file `/laravel-setup/react-integration/api.ts` ke `src/lib/api.ts`

### 5. Update React Components
Ganti mock data dengan API calls. Contoh:

**Before (Mock Data):**
```typescript
const products = [
  { id: 1, name: "ML 86 Diamonds", price: 22000 },
  // ...
];
```

**After (API Call):**
```typescript
import { productsAPI } from './lib/api';

const [products, setProducts] = useState([]);

useEffect(() => {
  async function fetchProducts() {
    const response = await productsAPI.getAll();
    setProducts(response.data);
  }
  fetchProducts();
}, []);
```

### 6. Run React App
```bash
npm run dev
# React will run on http://localhost:5173
```

---

## 🔗 Integration Checklist

- [ ] Laravel backend running on `localhost:8000`
- [ ] React frontend running on `localhost:5173`
- [ ] CORS configured correctly
- [ ] Sanctum installed and configured
- [ ] Database migrated
- [ ] API routes working (test with Postman)
- [ ] Login/Register working
- [ ] Token saved in localStorage
- [ ] API calls from React successful

---

## 🧪 Testing API with Postman

### 1. Register User
```
POST http://localhost:8000/api/register
Body (JSON):
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "phone": "081234567890"
}
```

### 2. Login
```
POST http://localhost:8000/api/login
Body (JSON):
{
  "email": "test@example.com",
  "password": "password123"
}

Response akan berisi token:
{
  "success": true,
  "token": "1|xxxxxxxxxxxxx",
  "user": {...}
}
```

### 3. Get Products (Public)
```
GET http://localhost:8000/api/products
```

### 4. Create Transaction (Protected)
```
POST http://localhost:8000/api/transactions
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
Body (JSON):
{
  "product_id": 1,
  "target_account": "1234567890",
  "server_id": "1234",
  "payment_method": "qris"
}
```

---

## 📚 API Endpoints Documentation

### Public Endpoints
- `POST /api/register` - Register user
- `POST /api/login` - Login user
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product detail
- `GET /api/products/popular` - Get popular products
- `GET /api/products/category/{category}` - Get products by category
- `GET /api/promos` - Get all promos
- `GET /api/promos/active` - Get active promos

### Protected Endpoints (Require Auth Token)
- `POST /api/logout` - Logout user
- `GET /api/user` - Get current user
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/topup` - Top up balance
- `GET /api/user/balance` - Get balance
- `GET /api/user/referral` - Get referral info
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/{id}` - Get transaction detail
- `GET /api/transactions/statistics` - Get transaction stats

### Admin Endpoints (Require Admin Role)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/{id}` - Update product
- `DELETE /api/admin/products/{id}` - Delete product
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/{id}/balance` - Update user balance
- `GET /api/admin/dashboard` - Get dashboard stats

---

## 🔐 Authentication Flow

1. User register/login → Get token
2. Save token to localStorage
3. Include token in API requests: `Authorization: Bearer {token}`
4. Token verified by Laravel Sanctum
5. If valid → Return data
6. If invalid → Return 401 Unauthorized

---

## 🚨 Common Issues & Solutions

### Issue: CORS Error
**Solution:**
- Check `config/cors.php` includes your frontend URL
- Add `SANCTUM_STATEFUL_DOMAINS` in `.env`
- Clear config cache: `php artisan config:clear`

### Issue: 401 Unauthorized
**Solution:**
- Check if token is saved in localStorage
- Check if token is included in Authorization header
- Verify token hasn't expired

### Issue: Database Connection Error
**Solution:**
- Check `.env` database credentials
- Make sure MySQL/PostgreSQL is running
- Test connection: `php artisan migrate`

---

## 🎯 Next Steps

1. **Payment Gateway Integration**
   - Midtrans for QRIS, VA, E-Wallet
   - Implement webhook handler

2. **Provider API Integration**
   - Digiflazz for game & pulsa
   - VIP Reseller for game topup
   - Auto process transactions

3. **Notification System**
   - Email notifications (Laravel Mail)
   - WhatsApp notifications (Fonnte/Wablas API)

4. **Queue Jobs**
   - Process transactions in background
   - Send notifications asynchronously

5. **Caching**
   - Cache products list
   - Cache user data
   - Use Redis for better performance

6. **Testing**
   - Write unit tests
   - API integration tests
   - E2E tests with Cypress

---

## 📖 Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)
- [React Query](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [Midtrans Payment Gateway](https://docs.midtrans.com/)

---

## 💡 Tips

- Use React Query untuk data fetching (caching, refetching, etc)
- Implement proper error handling
- Add loading states
- Use TypeScript untuk type safety
- Implement proper validation (frontend & backend)
- Add rate limiting untuk API
- Use environment variables untuk sensitive data
- Implement proper logging
- Add API documentation (Swagger/OpenAPI)

---

**Happy Coding! 🚀**
