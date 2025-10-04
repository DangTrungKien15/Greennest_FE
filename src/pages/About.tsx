import { useState, useEffect } from 'react';
import { Users, Lightbulb, Home, Leaf, Star, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white py-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1920&h=1080&fit=crop&crop=center')`
          }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <Sparkles className="w-8 h-8 text-yellow-300" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Giới Thiệu</h1>
          <p className="text-xl md:text-2xl text-green-100">Về GREENNEST - Nền tảng thiết kế không gian xanh</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Về GREENNEST</h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  <strong className="text-green-600">GREENNEST</strong> là nền tảng tiên phong trong thiết kế không gian sống xanh tập trung vào thế hệ Gen Z và Millennials – những người yêu thích không gian gần gũi thiên nhiên, hiện đại và có tính nhân văn.
                </p>
                
                <p>
                  Chúng tôi giúp bạn dễ dàng tạo nên không gian xanh mơ ước ngay tại nhà, văn phòng hay quán cà phê thông qua các dịch vụ thiết kế combo sản phẩm cây xanh - decor - ánh sáng - nội thất nhỏ gọn phù hợp với từng nhu cầu.
                </p>
                
                <p>
                  Với đội ngũ thiết kế chuyên nghiệp và am hiểu xu hướng sống xanh hiện đại. <strong className="text-green-600">GREENNEST</strong> cam kết mang đến trải nghiệm tiện lợi, sáng tạo và bền vững trong từng giải pháp thiết kế.
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-700 font-medium">Thiết kế chuyên nghiệp</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-700 font-medium">Sản phẩm chất lượng</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-700 font-medium">Bảo hành dài hạn</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-700 font-medium">Hỗ trợ 24/7</span>
              </div>
            </div>
          </div>

          {/* Right Column - Icons */}
          <div className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            {/* Target Audience Icons */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Đối tượng khách hàng</h3>
              <div className="flex justify-center space-x-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-10 h-10 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-2xl font-bold text-blue-600">Z</span>
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Gen Z</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lightbulb className="w-10 h-10 text-yellow-600" />
                  </div>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-2xl font-bold text-yellow-600">M</span>
                    <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center">
                      <Lightbulb className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Millennials</p>
                </div>
              </div>
            </div>

            {/* Space Design Icon */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Thiết kế không gian</h3>
              <div className="w-32 h-32 bg-gradient-to-br from-blue-200 to-blue-300 rounded-lg mx-auto flex items-center justify-center shadow-lg">
                <Home className="w-16 h-16 text-blue-600" />
              </div>
            </div>

            {/* Team Icons */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Đội ngũ chuyên nghiệp</h3>
              <div className="flex justify-center space-x-6">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                  <Star className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Image Section */}
        <div className={`mt-20 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=600&fit=crop&crop=center"
              alt="GREENNEST Green Space Design"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Không gian xanh mơ ước</h3>
              <p className="text-lg">Thiết kế chuyên nghiệp cho mọi không gian</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className={`mt-20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">GREENNEST trong số liệu</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                <div className="text-gray-600">Khách hàng hài lòng</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                <div className="text-gray-600">Dự án hoàn thành</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                <div className="text-gray-600">Tỷ lệ hài lòng</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">5+</div>
                <div className="text-gray-600">Năm kinh nghiệm</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`mt-20 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Sẵn sàng tạo không gian xanh?</h2>
            <p className="text-xl text-green-100 mb-8">
              Liên hệ với chúng tôi để được tư vấn thiết kế miễn phí
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Liên hệ ngay</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/services"
                className="bg-green-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-800 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Xem dịch vụ</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

