import { Leaf, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold text-white">GREENNEST</span>
            </div>
            <p className="text-gray-400 mb-4">
              Mang không gian xanh đến mọi nhà. Chúng tôi cung cấp cây cảnh chất lượng cao và dịch vụ tư vấn thiết kế không gian xanh chuyên nghiệp.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                Instagram
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                YouTube
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Liên kết</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-green-500 transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-green-500 transition-colors">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-green-500 transition-colors">
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-green-500 transition-colors">
                  Về chúng tôi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-green-500" />
                <span className="text-gray-400">0123 456 789</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-green-500" />
                <span className="text-gray-400">info@greennest.vn</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-green-500 mt-1" />
                <span className="text-gray-400">123 Đường ABC, Quận 1, TP.HCM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 GREENNEST. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
