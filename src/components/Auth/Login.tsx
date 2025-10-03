import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      
      // Debug: Log user data
      const savedUser = localStorage.getItem('greennest_user');
      console.log('Saved user data:', savedUser);
      
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        console.log('Parsed user data:', userData);
        console.log('User role:', userData.role);
        
        if (userData.role === 'ADMIN') {
          console.log('Redirecting to admin page');
          navigate('/admin');
        } else {
          console.log('Redirecting to home page (user role)');
          navigate('/');
        }
      } else {
        console.log('No saved user data, redirecting to home');
        navigate('/');
      }
    } catch (err: any) {
      // Display backend error message if available
      if (err.message) {
        setError(err.message);
      } else {
        setError('Đăng nhập thất bại. Vui lòng thử lại.');
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-gray-900 flex items-center justify-center p-8 relative">
        {/* Animated background elements */}
        <div 
          className="absolute top-20 left-10 w-16 h-16 bg-green-600 rounded-full opacity-20 animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
        ></div>
        <div 
          className="absolute bottom-20 right-10 w-12 h-12 bg-green-500 rounded-full opacity-25 animate-bounce"
          style={{ transform: `translateY(${scrollY * -0.03}px)` }}
        ></div>
        <div 
          className="absolute top-1/2 left-20 w-8 h-8 bg-green-400 rounded-full opacity-30 animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.04}px)` }}
        ></div>

        <div className="w-full max-w-md">
          <div 
            className={`bg-gray-800 rounded-2xl shadow-2xl p-8 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Logo size="lg" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Đăng nhập</h1>
              <p className="text-gray-400">Khách hàng, Đối tác, Nhân viên GREENNEST</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all hover:border-green-400"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Mật khẩu
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all hover:border-green-400"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-green-500 hover:text-green-400 font-semibold transition-colors">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://vuontungtoanjp.vn/wp-content/uploads/sites/7/2023/08/225.jpg')`
          }}
        ></div>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              GREENNEST
              <br />
              <span className="text-green-400">Plant Portal</span>
            </h2>
            <p className="text-xl text-gray-200 leading-relaxed mb-8">
              Là thương hiệu chuyên về cây cảnh và thiết kế không gian xanh, GREENNEST đã mở rộng 
              đầy đủ các dịch vụ từ thiết kế đến chăm sóc, góp phần tạo ra môi trường sống xanh 
              và bền vững cho mọi gia đình.
            </p>
            
            {/* Floating elements */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-200">Thiết kế cảnh quan chuyên nghiệp</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span className="text-gray-200">Cây cảnh chất lượng cao</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span className="text-gray-200">Dịch vụ chăm sóc tận tâm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div 
          className="absolute top-20 right-20 w-20 h-20 bg-green-500 rounded-full opacity-20 animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.06}px)` }}
        ></div>
        <div 
          className="absolute bottom-32 left-20 w-16 h-16 bg-green-400 rounded-full opacity-25 animate-bounce"
          style={{ transform: `translateY(${scrollY * -0.04}px)` }}
        ></div>
        <div 
          className="absolute top-1/3 right-32 w-12 h-12 bg-green-600 rounded-full opacity-30 animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.03}px)` }}
        ></div>
      </div>
    </div>
  );
}
