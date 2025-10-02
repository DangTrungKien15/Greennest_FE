# API Integration Guide - GreenNest Frontend

## 🚀 Đã tích hợp thành công API Backend

Dự án đã được tích hợp hoàn toàn với API backend tại `https://greennestbe.onrender.com/api`

## 📋 Các tính năng đã tích hợp

### ✅ 1. Authentication (Đăng nhập/Đăng ký)
- **Login**: `POST /api/auth/login`
- **Register**: `POST /api/auth/register`
- **Profile**: `GET /api/auth/profile`
- **Token management**: Tự động lưu và sử dụng JWT token

### ✅ 2. Products (Sản phẩm)
- **Get Products**: `GET /api/products` với filters (category, search, sort)
- **Get Product**: `GET /api/products/:id`
- **Real-time loading**: Loading states và error handling

### ✅ 3. Services (Dịch vụ)
- **Get Services**: `GET /api/services`
- **Get Service**: `GET /api/services/:id`
- **Dynamic loading**: Tải từ API thay vì mock data

### ✅ 4. Cart (Giỏ hàng)
- **Get Cart**: `GET /api/cart`
- **Add to Cart**: `POST /api/cart/add`
- **Update Quantity**: `PUT /api/cart/items/:id`
- **Remove Item**: `DELETE /api/cart/items/:id`
- **Clear Cart**: `DELETE /api/cart/clear`

### ✅ 5. Orders (Đơn hàng)
- **Create Order**: `POST /api/orders`
- **Get Orders**: `GET /api/orders`
- **Get Order**: `GET /api/orders/:id`

### ✅ 6. Admin Dashboard
- **Get Stats**: `GET /api/admin/stats`
- **Get Orders**: `GET /api/admin/orders`
- **Real-time data**: Tải dữ liệu thật từ API

## 🔧 Cấu trúc API Service

### ApiService Class
```typescript
// src/services/api.ts
class ApiService {
  private baseURL: string;
  private token: string | null = null;

  // Authentication methods
  async login(email: string, password: string)
  async register(email: string, password: string, name: string)
  async getProfile()

  // Products methods
  async getProducts(params?)
  async getProduct(id: string)

  // Cart methods
  async getCart()
  async addToCart(productId: string, quantity: number)
  async updateCartItem(itemId: string, quantity: number)
  async removeFromCart(itemId: string)
  async clearCart()

  // Orders methods
  async createOrder(orderData)
  async getOrders(params?)
  async getOrder(id: string)

  // Services methods
  async getServices()
  async getService(id: string)

  // Admin methods
  async getAdminStats()
  async getAdminOrders(params?)
}
```

## 🔐 Authentication Flow

1. **Login/Register**: Gọi API → Nhận token → Lưu vào localStorage
2. **Auto Login**: Kiểm tra token → Verify với API → Set user state
3. **Logout**: Clear token → Clear user state
4. **Protected Routes**: Kiểm tra user role (admin/user)

## 📱 Context Updates

### AuthContext
- ✅ Sử dụng API thật thay vì mock data
- ✅ Token management tự động
- ✅ Error handling cho login/register
- ✅ Auto-login khi có token hợp lệ

### CartContext
- ✅ Sync với API backend
- ✅ Real-time cart updates
- ✅ Error handling cho cart operations
- ✅ Loading states

## 🎨 UI Improvements

### Loading States
- ✅ Spinner cho tất cả API calls
- ✅ Loading messages phù hợp
- ✅ Disable buttons khi đang loading

### Error Handling
- ✅ Error messages cho user
- ✅ Retry buttons
- ✅ Fallback UI khi có lỗi

### Responsive Design
- ✅ Mobile-friendly
- ✅ Tablet support
- ✅ Desktop optimized

## 🚀 Cách sử dụng

### 1. Chạy dự án
```bash
npm run dev
```

### 2. Test Authentication
- Đăng ký tài khoản mới
- Đăng nhập với tài khoản có sẵn
- Test admin role (email chứa "admin")

### 3. Test Features
- Browse products (tải từ API)
- Add to cart (sync với backend)
- View services (tải từ API)
- Admin dashboard (dữ liệu thật)

## 🔍 API Endpoints Reference

### Base URL
```
https://greennestbe.onrender.com/api
```

### Authentication
```
POST /auth/login
POST /auth/register
GET  /auth/profile
```

### Products
```
GET  /products?category=&search=&sortBy=&sortOrder=
GET  /products/:id
```

### Cart
```
GET    /cart
POST   /cart/add
PUT    /cart/items/:id
DELETE /cart/items/:id
DELETE /cart/clear
```

### Orders
```
POST /orders
GET  /orders?page=&limit=&status=
GET  /orders/:id
```

### Services
```
GET /services
GET /services/:id
```

### Admin
```
GET /admin/stats
GET /admin/orders?page=&limit=&status=
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Error**: API đã được cấu hình CORS cho frontend
2. **Token Expired**: Tự động logout khi token hết hạn
3. **Network Error**: Hiển thị error message và retry button
4. **Loading Issues**: Check network connection và API status

### Debug Tips

1. **Check Network Tab**: Xem API calls trong DevTools
2. **Check Console**: Xem error logs
3. **Check LocalStorage**: Verify token và user data
4. **API Status**: Check `https://greennestbe.onrender.com/api-docs`

## 📈 Performance

- ✅ Lazy loading cho images
- ✅ Debounced search
- ✅ Optimized API calls
- ✅ Caching strategies
- ✅ Error boundaries

## 🔮 Next Steps

1. **Payment Integration**: Tích hợp PayOS với API orders
2. **Real-time Updates**: WebSocket cho cart/orders
3. **Offline Support**: Service Worker cho offline mode
4. **Analytics**: Track user behavior
5. **Testing**: Unit tests và integration tests

---

**🎉 Dự án đã sẵn sàng để deploy và sử dụng với API backend thật!**
