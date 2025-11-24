# 📱 Mobile API Documentation

Dokumentasi API khusus untuk pengembangan aplikasi mobile NS Games Topup.

## 🎯 Mobile API Overview

API ini dirancang khusus untuk aplikasi mobile dengan optimasi:
- ✅ Response yang lebih ringan
- ✅ Data yang sudah diformat untuk mobile
- ✅ Endpoint yang dioptimalkan untuk performa mobile
- ✅ Support untuk offline caching

## 🔗 Base URL

```
Production: https://api.nsgames.com/mobile
Development: http://localhost/NS-topupgames/ns-topup/public/api/mobile
```

## 📱 Mobile Endpoints

### 🎮 Games

#### Get All Games (Mobile Optimized)
```http
GET /mobile/games
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Mobile Legends",
      "slug": "mobile-legends",
      "image": "/uploads/games/ml.jpg",
      "category": "MOBA",
      "is_popular": true,
      "min_price": 5000,
      "max_price": 500000,
      "product_count": 15
    }
  ]
}
```

### 🛍️ Products

#### Get All Products (Mobile Optimized)
```http
GET /mobile/products
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "game_id": 1,
      "game_name": "Mobile Legends",
      "name": "86 Diamonds",
      "price": 25000,
      "formatted_price": "Rp 25.000",
      "discount_percentage": 10,
      "is_popular": true,
      "category": "Diamond"
    }
  ]
}
```

#### Get Products by Game (Mobile Optimized)
```http
GET /mobile/games/{gameId}/products
```

**Parameters:**
- `gameId` (integer): Game ID

## 🔐 Authentication untuk Mobile

### Login Flow untuk Mobile App

1. **User Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

2. **Response**
```json
{
  "success": true,
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "customer",
    "avatar_url": "/uploads/avatars/avatar_1.jpg",
    "balance": 50000,
    "level": "gold"
  }
}
```

3. **Menggunakan Token**
```http
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

## 📱 Mobile-Specific Features

### 🖼️ Image Optimization

Semua gambar sudah dioptimalkan untuk mobile:
- **Game Images**: 300x300px, WebP format
- **Avatar Images**: 150x150px, WebP format
- **Product Icons**: 100x100px, WebP format

### 💰 Price Formatting

Harga sudah diformat untuk tampilan mobile:
```json
{
  "price": 25000,
  "formatted_price": "Rp 25.000",
  "discount_percentage": 10,
  "original_price": 27500,
  "formatted_original_price": "Rp 27.500"
}
```

### 🏆 Level System untuk Mobile

```json
{
  "level": "gold",
  "level_info": {
    "name": "Gold Member",
    "color": "#FFD700",
    "icon": "crown",
    "benefits": [
      "Diskon 5%",
      "Priority Support",
      "Exclusive Products"
    ],
    "next_level": {
      "name": "Platinum",
      "required_spending": 15000000,
      "current_spending": 8500000,
      "progress_percentage": 56.7
    }
  }
}
```

## 🔄 Offline Support

### Caching Strategy

1. **Games List**: Cache for 1 hour
2. **Products**: Cache for 30 minutes
3. **User Profile**: Cache for 15 minutes
4. **Transaction History**: No cache (always fresh)

### Cache Headers
```http
Cache-Control: public, max-age=3600
ETag: "abc123"
Last-Modified: Wed, 21 Oct 2025 07:28:00 GMT
```

## 📊 Mobile Analytics Endpoints

### Track App Usage
```http
POST /api/mobile/analytics/track
Content-Type: application/json
Authorization: Bearer {token}

{
  "event": "game_view",
  "game_id": 1,
  "timestamp": "2025-01-01T10:00:00Z",
  "device_info": {
    "platform": "android",
    "version": "1.0.0",
    "device_model": "Samsung Galaxy S21"
  }
}
```

## 🔔 Push Notifications

### Register Device Token
```http
POST /api/mobile/notifications/register
Content-Type: application/json
Authorization: Bearer {token}

{
  "device_token": "fcm_token_here",
  "platform": "android",
  "app_version": "1.0.0"
}
```

### Notification Types
- `order_completed` - Order selesai
- `payment_success` - Pembayaran berhasil
- `balance_low` - Saldo rendah
- `new_product` - Produk baru
- `promotion` - Promo khusus

## 💳 Mobile Payment Integration

### Midtrans Mobile SDK
```http
POST /api/payment/create
Content-Type: application/json
Authorization: Bearer {token}

{
  "order_id": "ORDER-123",
  "amount": 25000,
  "customer_details": {
    "first_name": "John",
    "email": "john@example.com",
    "phone": "081234567890"
  },
  "mobile_app": true
}
```

**Response:**
```json
{
  "success": true,
  "snap_token": "snap_token_for_mobile",
  "redirect_url": "https://app.midtrans.com/snap/v1/transactions/snap_token",
  "mobile_deeplink": "midtrans://payment?token=snap_token"
}
```

## 🛠️ Mobile Development Guidelines

### React Native Integration

1. **Install Dependencies**
```bash
npm install @react-native-async-storage/async-storage
npm install react-native-image-picker
npm install @react-native-community/netinfo
```

2. **API Client Setup**
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://api.nsgames.com';

const apiClient = {
  async request(endpoint, options = {}) {
    const token = await AsyncStorage.getItem('auth_token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    };
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return response.json();
  }
};
```

3. **Image Handling**
```javascript
import { launchImageLibrary } from 'react-native-image-picker';

const uploadAvatar = async (imageUri) => {
  const formData = new FormData();
  formData.append('avatar', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'avatar.jpg'
  });
  
  return apiClient.request('/customer/profile', {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
```

### Flutter Integration

1. **HTTP Client**
```dart
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiClient {
  static const String baseUrl = 'https://api.nsgames.com';
  
  static Future<Map<String, String>> _getHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }
  
  static Future<http.Response> get(String endpoint) async {
    final headers = await _getHeaders();
    return http.get(Uri.parse('$baseUrl$endpoint'), headers: headers);
  }
}
```

## 🧪 Mobile Testing

### Test Endpoints
```bash
# Test mobile games endpoint
curl -X GET "http://localhost/NS-topupgames/ns-topup/public/api/mobile/games"

# Test mobile products endpoint
curl -X GET "http://localhost/NS-topupgames/ns-topup/public/api/mobile/products"

# Test authentication
curl -X POST "http://localhost/NS-topupgames/ns-topup/public/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@example.com","password":"password"}'
```

## 📈 Performance Optimization

### Response Size Optimization
- Menghilangkan field yang tidak diperlukan mobile
- Menggunakan pagination untuk list data
- Kompresi gambar otomatis
- Caching response di level server

### Network Optimization
- HTTP/2 support
- GZIP compression
- CDN untuk static assets
- Connection pooling

## 🔒 Security untuk Mobile

### API Security
- Rate limiting per device
- JWT token expiration
- Device fingerprinting
- SSL/TLS encryption

### Data Protection
- Sensitive data encryption
- Secure storage (Keychain/Keystore)
- Certificate pinning
- Root/Jailbreak detection

## 📱 Platform-Specific Considerations

### Android
- Minimum SDK: 21 (Android 5.0)
- Target SDK: 34 (Android 14)
- ProGuard obfuscation
- Google Play Store guidelines

### iOS
- Minimum iOS: 12.0
- Swift 5.0+
- App Store guidelines
- Privacy manifest requirements

Dokumentasi ini menyediakan semua yang diperlukan untuk mengembangkan aplikasi mobile yang terintegrasi dengan platform NS Games Topup! 📱🎮