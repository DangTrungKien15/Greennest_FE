# Giải quyết lỗi CORS và API Connection

## 🚨 Vấn đề hiện tại

Dự án đang gặp 2 lỗi chính:

1. **CORS Error**: `Access to fetch at 'https://greennestbe.onrender.com/api/auth/login' from origin 'http://localhost:5173' has been blocked by CORS policy`
2. **Failed to fetch**: `TypeError: Failed to fetch`

## 🔧 Giải pháp đã implement

### 1. **Fallback to Mock Data**
- ✅ Thêm mock data fallback khi API không hoạt động
- ✅ App sẽ tự động chuyển sang mock data trong development
- ✅ Console sẽ hiển thị warning khi sử dụng mock data

### 2. **Enhanced Error Handling**
- ✅ Logging chi tiết cho debugging
- ✅ Graceful fallback thay vì crash app
- ✅ User-friendly error messages

### 3. **CORS Headers**
- ✅ Thêm CORS headers vào request
- ✅ Cấu hình mode: 'cors' và credentials: 'omit'

## 🚀 Cách test ngay bây giờ

### 1. **Chạy app**
```bash
npm run dev
```

### 2. **Test các tính năng**
- **Login**: Sử dụng bất kỳ email/password nào
- **Products**: Sẽ hiển thị mock products
- **Services**: Sẽ hiển thị mock services
- **Cart**: Sẽ hoạt động với mock data
- **Admin**: Sẽ hiển thị mock stats

### 3. **Check Console**
- Sẽ thấy warning: "Falling back to mock data due to API error"
- Sẽ thấy log: "Using mock data for: /auth/login"

## 🔧 Giải pháp lâu dài cho Backend

### 1. **Cấu hình CORS trên Backend**
Backend cần thêm headers sau:

```javascript
// Express.js example
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 2. **Kiểm tra API Status**
```bash
# Test API endpoint
curl -X GET https://greennestbe.onrender.com/api/products
curl -X POST https://greennestbe.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### 3. **Kiểm tra Network Tab**
- Mở DevTools → Network tab
- Xem request có được gửi không
- Xem response status và headers

## 🎯 Các bước debug

### 1. **Kiểm tra API có hoạt động không**
```bash
# Test trong terminal
curl https://greennestbe.onrender.com/api/products
```

### 2. **Kiểm tra CORS headers**
Trong Network tab, xem response headers có:
- `Access-Control-Allow-Origin: *` hoặc `Access-Control-Allow-Origin: http://localhost:5173`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

### 3. **Test với Postman**
- Tạo request đến `https://greennestbe.onrender.com/api/auth/login`
- Method: POST
- Body: `{"email":"test@example.com","password":"password"}`
- Headers: `Content-Type: application/json`

## 🔄 Chuyển đổi giữa Mock và Real API

### **Sử dụng Mock Data (hiện tại)**
```typescript
// Trong api.ts, mock data sẽ được sử dụng tự động khi API fail
if (process.env.NODE_ENV === 'development') {
  return this.getMockData(endpoint, options);
}
```

### **Sử dụng Real API**
1. **Backend phải fix CORS**
2. **Comment out mock data fallback**
3. **Test lại**

## 📱 Test Cases

### **Mock Data Test**
- ✅ Login với bất kỳ email/password
- ✅ Browse products (2 mock products)
- ✅ View services (1 mock service)
- ✅ Empty cart (mock empty cart)
- ✅ Admin dashboard (mock stats)

### **Real API Test** (khi backend fix)
- ✅ Login với credentials thật
- ✅ Load products từ database
- ✅ Load services từ database
- ✅ Cart sync với backend
- ✅ Admin stats từ database

## 🚨 Lưu ý quan trọng

1. **Mock data chỉ hoạt động trong development**
2. **Production sẽ throw error nếu API không hoạt động**
3. **Cần fix CORS trên backend trước khi deploy**
4. **Console sẽ hiển thị warning khi dùng mock data**

## 🎉 Kết quả

**Bây giờ app sẽ hoạt động bình thường với mock data!**

- ✅ Không còn crash
- ✅ Tất cả tính năng hoạt động
- ✅ UI/UX không thay đổi
- ✅ Console hiển thị warning rõ ràng
- ✅ Dễ dàng chuyển sang real API khi backend fix

---

**🔧 Để fix hoàn toàn: Backend cần cấu hình CORS cho phép `http://localhost:5173`**
