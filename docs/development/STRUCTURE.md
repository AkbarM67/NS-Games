# 📁 Project Structure Documentation

## 🏗️ Overall Architecture

```
NS-topupgames/
├── 📂 ns-topup/                    # Laravel Backend API
├── 📂 frontend_admin/              # React Admin Dashboard  
├── 📂 frontend-customer/           # React Customer Portal
├── 📄 README.md                    # Main documentation
├── 📄 STRUCTURE.md                 # This file
├── 📄 MOBILE-API.md                # Mobile API documentation
├── 📄 package.json                 # Workspace management
└── 📄 .gitignore                   # Git ignore rules
```

## 🔧 Backend Structure (ns-topup/)

```
ns-topup/
├── 📂 app/
│   ├── 📂 Http/Controllers/Api/
│   │   ├── 📂 Admin/
│   │   │   ├── AdminProfileController.php    # Admin profile management
│   │   │   ├── CustomerController.php        # Customer management
│   │   │   ├── GameController.php           # Game management
│   │   │   └── ProductController.php        # Product management
│   │   ├── 📂 Customer/
│   │   │   ├── GameController.php           # Customer game catalog
│   │   │   ├── OrderController.php          # Customer orders
│   │   │   ├── PopularController.php        # Popular games
│   │   │   └── ProfileController.php        # Customer profile
│   │   ├── AuthController.php               # Authentication
│   │   ├── DashboardController.php          # Dashboard data
│   │   ├── DigiflazzController.php          # Digiflazz integration
│   │   ├── GeneralSettingsController.php    # App settings
│   │   ├── MidtransTestController.php       # Midtrans testing
│   │   ├── OrderController.php              # Order management
│   │   ├── PaymentController.php            # Payment processing
│   │   ├── ProviderController.php           # Provider management
│   │   ├── ProviderSettingsController.php   # Provider settings
│   │   └── SystemController.php             # System utilities
│   ├── 📂 Models/
│   │   ├── ActivityLog.php                  # Activity logging
│   │   ├── Game.php                         # Game model
│   │   ├── Order.php                        # Order model
│   │   ├── Product.php                      # Product model
│   │   ├── Setting.php                      # Settings model
│   │   └── User.php                         # User model (with avatar)
│   ├── 📂 Services/
│   │   ├── DigiFlazzService.php             # Digiflazz API service
│   │   └── MidtransService.php              # Midtrans API service
│   └── 📂 Middleware/
│       └── AdminMiddleware.php              # Admin role middleware
├── 📂 database/
│   ├── 📂 migrations/                       # Database migrations
│   │   ├── 2014_10_12_000000_create_users_table.php
│   │   ├── 2024_01_01_000001_create_orders_table.php
│   │   ├── 2024_01_01_000002_create_games_table.php
│   │   ├── 2024_01_01_000003_create_products_table.php
│   │   ├── 2024_01_01_000004_create_settings_table.php
│   │   ├── 2024_01_01_000005_create_activity_logs_table.php
│   │   └── 2025_11_22_070852_add_avatar_url_to_users_table.php
│   └── 📂 seeders/                          # Database seeders
│       ├── DatabaseSeeder.php
│       ├── UserSeeder.php
│       ├── GameSeeder.php
│       ├── ProductSeeder.php
│       └── SettingSeeder.php
├── 📂 public/
│   ├── 📂 uploads/
│   │   └── 📂 avatars/                      # User avatar uploads
│   └── index.php
├── 📂 routes/
│   ├── api.php                              # API routes
│   └── web.php                              # Web routes
├── 📂 storage/
│   ├── 📂 api-docs/
│   │   └── api-docs.json                    # Swagger documentation
│   ├── 📂 app/                              # File storage
│   ├── 📂 framework/                        # Laravel framework files
│   └── 📂 logs/                             # Application logs
├── 📄 .env.example                          # Environment template
├── 📄 composer.json                         # PHP dependencies
└── 📄 README.md                             # Backend documentation
```

## 🎨 Frontend Admin Structure (frontend_admin/)

```
frontend_admin/
├── 📂 src/
│   ├── 📂 components/
│   │   ├── 📂 ui/                           # Reusable UI components
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   └── label.tsx
│   │   ├── AdminProfile.tsx                 # Admin profile management
│   │   ├── DashboardOverview.tsx            # Dashboard overview
│   │   ├── FinancialReports.tsx             # Financial reports
│   │   ├── Header.tsx                       # Navigation header
│   │   ├── MarketingPromo.tsx               # Marketing & promotions
│   │   ├── ProductManagement.tsx            # Product management
│   │   ├── SettingsPage.tsx                 # Settings page
│   │   ├── Sidebar.tsx                      # Navigation sidebar
│   │   ├── TransactionManagement.tsx        # Transaction management
│   │   └── UserManagement.tsx               # User management
│   ├── 📂 lib/
│   │   └── api.ts                           # Axios API configuration
│   ├── App.tsx                              # Main application
│   ├── main.tsx                             # Entry point
│   └── index.css                            # Global styles
├── 📂 public/                               # Static assets
├── 📄 index.html                            # HTML template
├── 📄 package.json                          # Dependencies
├── 📄 tailwind.config.js                    # Tailwind configuration
├── 📄 tsconfig.json                         # TypeScript configuration
├── 📄 vite.config.ts                        # Vite configuration
└── 📄 README.md                             # Frontend admin docs
```

## 👥 Frontend Customer Structure (frontend-customer/)

```
frontend-customer/
├── 📂 src/
│   ├── 📂 components/
│   │   ├── 📂 user/                         # Customer-specific components
│   │   │   ├── OrderPage.tsx                # Order form
│   │   │   ├── ProductCatalog.tsx           # Game catalog
│   │   │   ├── TransactionHistory.tsx       # Transaction history
│   │   │   ├── UserHeader.tsx               # Customer header
│   │   │   ├── UserHomepage.tsx             # Customer homepage
│   │   │   └── UserProfile.tsx              # Customer profile
│   │   └── 📂 ui/                           # Reusable UI components
│   ├── 📂 lib/
│   │   └── api.ts                           # API configuration
│   ├── App.tsx                              # Main application
│   ├── main.tsx                             # Entry point
│   └── index.css                            # Global styles
├── 📂 public/                               # Static assets
├── 📄 index.html                            # HTML template
├── 📄 package.json                          # Dependencies
├── 📄 tailwind.config.js                    # Tailwind configuration
├── 📄 tsconfig.json                         # TypeScript configuration
├── 📄 vite.config.ts                        # Vite configuration
└── 📄 README.md                             # Frontend customer docs
```

## 🔗 Integration Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Frontend Admin │    │  Laravel API    │    │ Frontend Customer│
│  (Port 3000)   │    │  (Port 8000)    │    │  (Port 3001)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │ ◄─── API Calls ──────► │ ◄─── API Calls ──────►│
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         │              │     Database    │              │
         │              │     (MySQL)     │              │
         │              └─────────────────┘              │
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         │              │ External APIs   │              │
         │              │ • Digiflazz     │              │
         │              │ • Midtrans      │              │
         │              └─────────────────┘              │
```

## 📊 Database Schema Overview

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Users    │    │   Orders    │    │    Games    │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ id (PK)     │◄──┐│ id (PK)     │    │ id (PK)     │
│ role        │   └│ user_id (FK)│    │ name        │
│ avatar_url  │    │ game_name   │    │ slug        │
│ name        │    │ amount      │    │ image       │
│ email       │    │ status      │    │ category    │
│ phone       │    │ created_at  │    │ is_active   │
│ balance     │    └─────────────┘    └─────────────┘
│ is_blocked  │                              │
│ created_at  │    ┌─────────────┐           │
└─────────────┘    │  Products   │           │
                   ├─────────────┤           │
                   │ id (PK)     │           │
                   │ game_id (FK)│───────────┘
                   │ name        │
                   │ price       │
                   │ digiflazz_code│
                   │ is_active   │
                   └─────────────┘
```

## 🔐 Security Structure

### Authentication Flow
```
1. User Login (Laravel) → Token Generation
2. Token passed to Frontend → Stored in localStorage
3. API Requests → Bearer Token Authentication
4. Role-based Access Control → Admin/Customer separation
```

### File Upload Security
```
📁 public/uploads/avatars/
├── Validation: image types only (JPEG, PNG, JPG, GIF)
├── Size limit: 2MB maximum
├── Naming: avatar_{role}_{user_id}_{timestamp}.{ext}
└── Access: Public read, authenticated write
```

## 🚀 Deployment Structure

### Development
```
Laravel Backend:  http://127.0.0.1:8000
Admin Frontend:   http://localhost:3000
Customer Frontend: http://localhost:3001
```

### Production (Recommended)
```
Backend API:      https://api.nsgames.com
Admin Panel:      https://admin.nsgames.com
Customer Portal:  https://nsgames.com
```

## 📝 Configuration Files

### Backend (.env)
```
DB_CONNECTION=mysql
MIDTRANS_SERVER_KEY=xxx
MIDTRANS_CLIENT_KEY=xxx
```

### Frontend (vite.config.ts)
```typescript
export default defineConfig({
  server: {
    port: 3000, // Admin: 3000, Customer: 3001
    host: true
  }
});
```

## 🔄 Data Flow

### User Management
```
Admin Dashboard → API → Database → Real-time Updates
Customer Portal → API → Database → Profile Updates
```

### Payment Processing
```
Customer Order → Midtrans → Webhook → Digiflazz → Order Complete
```

### File Uploads
```
Frontend → FormData → Laravel API → Storage → Database URL
```