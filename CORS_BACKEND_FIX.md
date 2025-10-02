# 🔧 CORS Backend Fix Guide

## 🚨 Vấn đề hiện tại

Frontend đang gặp lỗi CORS khi gọi API:
```
Access to fetch at 'https://greennestbe.onrender.com/api/auth/register' from origin 'http://localhost:5173' has been blocked by CORS policy: Request header field access-control-allow-methods is not allowed by Access-Control-Allow-Headers in preflight response.
```

## ✅ Giải pháp cho Backend Developer

### 1. **Cấu hình CORS Headers**

Backend cần thêm các headers sau vào response:

```javascript
// Express.js example
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Hoặc chỉ định domain cụ thể
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
```

### 2. **Sử dụng CORS Middleware (Khuyến nghị)**

```bash
npm install cors
```

```javascript
const cors = require('cors');

// Cấu hình CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Frontend URLs
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));
```

### 3. **Cấu hình cho Production**

```javascript
const allowedOrigins = [
  'http://localhost:5173',  // Development
  'http://localhost:3000',   // Development
  'https://yourdomain.com'   // Production
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

### 4. **Kiểm tra API Endpoints**

Đảm bảo các endpoints sau hoạt động:

- ✅ `POST /api/auth/register`
- ✅ `POST /api/auth/login`
- ✅ `GET /api/auth/profile`
- ✅ `GET /api/products`
- ✅ `GET /api/services`
- ✅ `GET /api/cart`
- ✅ `POST /api/cart`
- ✅ `GET /api/admin/stats`

### 5. **Test CORS**

Sau khi fix, test bằng cách:

```bash
# Test preflight request
curl -X OPTIONS \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  https://greennestbe.onrender.com/api/auth/register

# Test actual request
curl -X POST \
  -H "Origin: http://localhost:5173" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","name":"Test User"}' \
  https://greennestbe.onrender.com/api/auth/register
```

## 🎯 Kết quả mong đợi

Sau khi fix CORS:
- ✅ Frontend có thể gọi API thành công
- ✅ Đăng ký/đăng nhập hoạt động thực tế
- ✅ Không còn lỗi CORS trong console
- ✅ Dữ liệu thực từ backend được load

## 📞 Liên hệ

Nếu cần hỗ trợ thêm về CORS hoặc API integration, vui lòng liên hệ team backend.

---

**Lưu ý:** Frontend đã được cấu hình để không gửi CORS headers từ client-side (điều này là đúng). Backend cần xử lý CORS ở server-side.
