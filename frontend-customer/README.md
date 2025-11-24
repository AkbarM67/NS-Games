# Frontend Customer - React Portal

Customer portal untuk platform topup game NS Games.

## 🏗️ Struktur Project

```
frontend-customer/
├── src/
│   ├── components/
│   │   ├── user/
│   │   │   ├── UserHeader.tsx         # Navigation header
│   │   │   ├── UserHomepage.tsx       # Homepage
│   │   │   ├── UserProfile.tsx        # Profile management
│   │   │   ├── ProductCatalog.tsx     # Game catalog
│   │   │   ├── OrderPage.tsx          # Order form
│   │   │   └── TransactionHistory.tsx # Transaction history
│   │   └── ui/                        # Reusable components
│   ├── lib/
│   │   └── api.ts                     # API configuration
│   ├── App.tsx                        # Main application
│   └── main.tsx                       # Entry point
└── package.json                       # Dependencies
```

## 🚀 Installation

1. **Install dependencies**
```bash
npm install
```

2. **Start development server**
```bash
npm run dev
```

3. **Build for production**
```bash
npm run build
```

## 🔧 Configuration

### API Configuration
File: `src/lib/api.ts`
```typescript
const api = axios.create({
  baseURL: 'http://localhost/NS-topupgames/ns-topup/public/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});
```

### Environment Variables
```env
VITE_API_URL=http://localhost/NS-topupgames/ns-topup/public/api
VITE_APP_URL=http://localhost:3001
```

## 🎯 Features

### Homepage
- ✅ Game catalog display
- ✅ Popular games section
- ✅ Quick access navigation
- ✅ Responsive design

### User Profile
- ✅ Profile information display
- ✅ Avatar upload with preview
- ✅ Balance information
- ✅ Level system (Bronze, Silver, Gold, Platinum)
- ✅ Profile editing

### Product Catalog
- ✅ Game categories
- ✅ Product filtering
- ✅ Price display
- ✅ Quick order

### Order Management
- ✅ Order form
- ✅ Payment integration (Midtrans)
- ✅ Order confirmation
- ✅ Real-time status

### Transaction History
- ✅ Transaction list
- ✅ Status tracking
- ✅ Indonesian date formatting
- ✅ Order details

### Header Navigation
- ✅ Real-time balance display
- ✅ User avatar
- ✅ Navigation menu
- ✅ Logout functionality

## 🔐 Authentication

### Login Flow
```typescript
useEffect(() => {
  // Check URL parameters for token
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromUrl = urlParams.get('token');
  const userFromUrl = urlParams.get('user');
  
  if (tokenFromUrl && userFromUrl) {
    const userData = JSON.parse(decodeURIComponent(userFromUrl));
    setToken(tokenFromUrl);
    setUser(userData);
    setIsLoggedIn(true);
    
    // Store in localStorage
    localStorage.setItem('token', tokenFromUrl);
    localStorage.setItem('user', JSON.stringify(userData));
  }
}, []);
```

### Role Validation
```typescript
// Customer role validation (temporarily disabled for debugging)
if (userData.role !== 'customer') {
  console.log('Role mismatch, but allowing access for debugging');
}
```

## 🎨 UI Components

### User Header
```typescript
export function UserHeader({ 
  activePage, 
  setActivePage, 
  isLoggedIn, 
  user, 
  onLogout 
}) {
  // Real-time balance fetching
  // Avatar display
  // Navigation menu
}
```

### User Profile
```typescript
export function UserProfile() {
  // Profile data fetching
  // Avatar upload
  // Profile editing
  // Balance display
}
```

## 💰 Balance System

### Real-time Balance
```typescript
const fetchBalance = async () => {
  try {
    const response = await api.get('/customer/profile');
    if (response.data.success) {
      setBalance(response.data.user.balance);
    }
  } catch (error) {
    console.error('Error fetching balance:', error);
  }
};
```

### Balance Display
```typescript
<div className="text-right">
  <p className="text-sm text-gray-600">Saldo</p>
  <p className="text-lg font-semibold text-green-600">
    Rp {balance.toLocaleString('id-ID')}
  </p>
</div>
```

## 🏆 Level System

### Level Calculation
```typescript
const getUserLevel = (totalSpent: number) => {
  if (totalSpent >= 15000000) return 'platinum';
  if (totalSpent >= 5000000) return 'gold';
  if (totalSpent >= 1000000) return 'silver';
  return 'bronze';
};
```

### Level Badge
```typescript
const getLevelBadge = (level: string) => {
  const configs = {
    bronze: { bg: "bg-orange-100", text: "text-orange-700" },
    silver: { bg: "bg-gray-100", text: "text-gray-700" },
    gold: { bg: "bg-yellow-100", text: "text-yellow-700" },
    platinum: { bg: "bg-purple-100", text: "text-purple-700" }
  };
  return configs[level];
};
```

## 🖼️ Avatar Management

### Avatar Display
```typescript
{user.avatar_url ? (
  <img 
    src={`http://localhost/NS-topupgames/ns-topup/public${user.avatar_url}`}
    alt="User Avatar"
    className="w-full h-full object-cover"
  />
) : (
  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
    {user.name.charAt(0)}
  </div>
)}
```

### Avatar Upload
```typescript
const handleAvatarUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  try {
    const response = await api.post('/customer/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    if (response.data.success) {
      // Update UI with new avatar
      fetchUserProfile();
    }
  } catch (error) {
    console.error('Avatar upload failed:', error);
  }
};
```

## 📱 Responsive Design

### Mobile Navigation
```typescript
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

// Mobile menu toggle
<button 
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  className="md:hidden"
>
  <Menu className="w-6 h-6" />
</button>
```

### Responsive Grid
```css
.grid {
  @apply grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4;
}
```

## 🔄 State Management

### Page Navigation
```typescript
const [activePage, setActivePage] = useState("home");

const renderPage = () => {
  switch (activePage) {
    case "home": return <UserHomepage />;
    case "catalog": return <ProductCatalog />;
    case "order": return <OrderPage />;
    case "history": return <TransactionHistory />;
    case "profile": return <UserProfile />;
    default: return <UserHomepage />;
  }
};
```

### User State
```typescript
const [user, setUser] = useState(null);
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [loading, setLoading] = useState(true);
```

## 🚀 Deployment

### Development
```bash
npm run dev
# Runs on http://localhost:3001
```

### Production
```bash
npm run build
npm run preview
```

## 📦 Dependencies

### Core
- React 18
- TypeScript
- Vite

### UI & Styling
- Tailwind CSS
- Lucide React (icons)

### HTTP Client
- Axios

### Utilities
- Date formatting
- Number formatting (Indonesian locale)