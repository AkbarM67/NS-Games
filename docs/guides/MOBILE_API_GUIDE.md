# 📱 Mobile App API Guide

## Base URL
```
http://localhost:8000/api
```

## 🔐 Authentication Flow

### 1. Register User
```http
POST /api/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com", 
    "password": "password123",
    "password_confirmation": "password123"
}
```

### 2. Login
```http
POST /api/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "password123"
}
```

**Response:**
```json
{
    "message": "Login successful",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "customer"
    },
    "token": "1|abcdef123456..."
}
```

### 3. Store Token
Simpan token di SharedPreferences/UserDefaults dan gunakan di header:
```
Authorization: Bearer 1|abcdef123456...
```

## 📱 Mobile App Screens & Endpoints

### Home Screen - Games List
```http
GET /api/games
```
**Response:** List games dengan produk top-up

### Game Detail Screen
```http
GET /api/games/{id}
```
**Response:** Detail game dengan semua paket

### Profile Screen
```http
GET /api/customer/profile
Authorization: Bearer {token}
```

### Edit Profile
```http
PUT /api/customer/profile
Authorization: Bearer {token}
Content-Type: multipart/form-data

name: John Doe Updated
email: john.updated@example.com
avatar: [file]
```

### Order History Screen
```http
GET /api/customer/orders
Authorization: Bearer {token}
```

### Create Order
```http
POST /api/customer/orders
Authorization: Bearer {token}
Content-Type: application/json

{
    "product_id": 1,
    "player_id": "123456789",
    "server_id": "2001",
    "payment_method": "BCA"
}
```

### Upload Payment Proof
```http
POST /api/customer/orders/{id}/payment-proof
Authorization: Bearer {token}
Content-Type: multipart/form-data

payment_proof: [image file]
```

### Order Detail
```http
GET /api/customer/orders/{id}
Authorization: Bearer {token}
```

## 📲 Mobile Implementation Examples

### Android (Retrofit)
```java
// API Interface
public interface ApiService {
    @POST("login")
    Call<LoginResponse> login(@Body LoginRequest request);
    
    @GET("games")
    Call<List<Game>> getGames();
    
    @GET("customer/orders")
    Call<OrderResponse> getOrders(@Header("Authorization") String token);
    
    @Multipart
    @POST("customer/orders/{id}/payment-proof")
    Call<ApiResponse> uploadPaymentProof(
        @Path("id") int orderId,
        @Part MultipartBody.Part file,
        @Header("Authorization") String token
    );
}

// Usage
String token = "Bearer " + sharedPrefs.getString("token", "");
apiService.getOrders(token).enqueue(callback);
```

### iOS (Swift)
```swift
// API Manager
class APIManager {
    static let baseURL = "http://localhost:8000/api"
    
    func login(email: String, password: String, completion: @escaping (Result<LoginResponse, Error>) -> Void) {
        // Implementation
    }
    
    func getGames(completion: @escaping (Result<[Game], Error>) -> Void) {
        // Implementation
    }
    
    func uploadPaymentProof(orderId: Int, image: UIImage, completion: @escaping (Result<ApiResponse, Error>) -> Void) {
        // Implementation
    }
}

// Usage
let token = UserDefaults.standard.string(forKey: "token") ?? ""
let headers = ["Authorization": "Bearer \(token)"]
```

### Flutter (Dio)
```dart
// API Service
class ApiService {
  final Dio _dio = Dio();
  final String baseUrl = 'http://localhost:8000/api';
  
  Future<LoginResponse> login(String email, String password) async {
    final response = await _dio.post('$baseUrl/login', data: {
      'email': email,
      'password': password,
    });
    return LoginResponse.fromJson(response.data);
  }
  
  Future<List<Game>> getGames() async {
    final response = await _dio.get('$baseUrl/games');
    return (response.data as List).map((e) => Game.fromJson(e)).toList();
  }
  
  Future<void> uploadPaymentProof(int orderId, File image) async {
    String token = await getToken();
    FormData formData = FormData.fromMap({
      'payment_proof': await MultipartFile.fromFile(image.path),
    });
    
    await _dio.post(
      '$baseUrl/customer/orders/$orderId/payment-proof',
      data: formData,
      options: Options(headers: {'Authorization': 'Bearer $token'}),
    );
  }
}
```

## 🔄 Error Handling

### Common HTTP Status Codes
- `200` - Success
- `401` - Unauthorized (token invalid/expired)
- `403` - Forbidden (insufficient permissions)
- `422` - Validation Error
- `500` - Server Error

### Error Response Format
```json
{
    "message": "The given data was invalid.",
    "errors": {
        "email": ["The email field is required."],
        "password": ["The password field is required."]
    }
}
```

## 📂 File Upload Guidelines

### Image Upload (Avatar, Payment Proof)
- **Max Size:** 5MB
- **Formats:** JPEG, PNG, JPG
- **Content-Type:** `multipart/form-data`

### Example Upload
```http
POST /api/customer/orders/1/payment-proof
Authorization: Bearer {token}
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="payment_proof"; filename="proof.jpg"
Content-Type: image/jpeg

[binary image data]
--boundary--
```

## 🚀 Ready for Mobile Development!

Semua endpoint sudah siap untuk:
- ✅ **Android** (Java/Kotlin)
- ✅ **iOS** (Swift/Objective-C) 
- ✅ **Flutter** (Dart)
- ✅ **React Native** (JavaScript)
- ✅ **Xamarin** (C#)

API menggunakan standar REST dengan JSON response, cocok untuk semua platform mobile! 📱