import { Leaf, Facebook, Twitter, Instagram, Linkedin, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-green-900 text-white overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url('https://topanh.com/wp-content/uploads/2025/05/anh-cay-coi-thien-nhien-1.jpg')`
        }}
      ></div>
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-green-900 bg-opacity-80"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Về chúng tôi */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-white">GREENNEST</span>
            </div>
            
            <p className="text-gray-300 leading-relaxed">
              Chuyên thiết kế cảnh quan, văn phòng, ban công, terrarium, hồ cá. 
              Địa chỉ: Vinhome Grand Park, TP HCM. Hotline: 0867976303
            </p>

            <div className="space-y-3">
              <p className="text-white font-medium">Follow us</p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Thông tin */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg">Thông tin</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors">
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to="/agent" className="text-gray-300 hover:text-white transition-colors">
                  Liên hệ làm đại lý
                </Link>
              </li>
            </ul>
          </div>

          {/* Danh mục chính */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg">Danh mục chính</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors">
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-300 hover:text-white transition-colors">
                  Công trình
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors">
                  Cây cảnh
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Chia sẻ kinh nghiệm
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white border-opacity-20 mt-12 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            © 2025 GREENNEST. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 z-50 flex items-center justify-center"
        >
          <ArrowUp className="w-6 h-6 text-green-600" />
        </button>
      )}
    </footer>
  );
}
