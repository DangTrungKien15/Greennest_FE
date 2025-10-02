import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Mail, Lock, User as UserIcon, Eye, EyeOff, Phone, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  // Password validation function
  const validatePassword = (password: string) => {
    const errors = [];
    
    if (password.length < 6) {
      errors.push('Mật khẩu phải có ít nhất 6 ký tự');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Mật khẩu phải có ít nhất 1 chữ in hoa');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Mật khẩu phải có ít nhất 1 ký hiệu đặc biệt');
    }
    
    return errors;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    // Clear previous errors
    setPasswordError('');
    
    // Validate password in real-time
    if (newPassword.length > 0) {
      const errors = validatePassword(newPassword);
      if (errors.length > 0) {
        setPasswordError(errors[0]); // Show first error
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPasswordError('');

    // Client-side validation
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setPasswordError(passwordErrors[0]);
      return;
    }

    try {
      await register(email, password, firstName, lastName, phone, image);
      
      // Redirect based on user role
      const savedUser = localStorage.getItem('greennest_user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        if (userData.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    } catch (err: any) {
      // Handle backend error message
      if (err.message && err.message.includes('Mật khẩu phải')) {
        setPasswordError(err.message);
      } else {
        setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Leaf className="w-16 h-16 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">GREENNEST</h2>
            <p className="text-gray-600 mt-2">Tạo tài khoản mới</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                Tên
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Văn A"
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Họ
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Nguyễn"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="user@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                    passwordError 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-green-500'
                  }`}
                  placeholder="Secret123!"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-600 text-sm mt-1">{passwordError}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Mật khẩu phải ≥6 ký tự, có 1 chữ in hoa và 1 ký hiệu đặc biệt
              </p>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0123456789"
                />
              </div>
            </div>

            {/* Image */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Ảnh đại diện (URL)
              </label>
              <div className="relative">
                <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="image"
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Tùy chọn: Nhập URL ảnh đại diện</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {passwordError && !error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {passwordError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !!passwordError}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
