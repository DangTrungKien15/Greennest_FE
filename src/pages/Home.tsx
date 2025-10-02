import { Link } from 'react-router-dom';
import { Leaf, ShoppingBag, Heart, TrendingUp, Shield, Truck } from 'lucide-react';
import { useState, useEffect } from 'react';
import Logo from '../components/Logo';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: Leaf,
      title: 'Cây xanh chất lượng',
      description: 'Chọn lọc từ các vườn ươm uy tín, đảm bảo cây khỏe mạnh và phát triển tốt'
    },
    {
      icon: ShoppingBag,
      title: 'Đa dạng sản phẩm',
      description: 'Hơn 500+ loại cây cảnh từ trong nhà đến ngoài trời, phù hợp mọi không gian'
    },
    {
      icon: Heart,
      title: 'Tư vấn miễn phí',
      description: 'Đội ngũ chuyên gia hỗ trợ tư vấn thiết kế và chăm sóc cây 24/7'
    },
    {
      icon: Truck,
      title: 'Giao hàng nhanh',
      description: 'Vận chuyển cẩn thận, đảm bảo cây đến tay khách hàng trong tình trạng tốt nhất'
    },
    {
      icon: Shield,
      title: 'Bảo hành cây',
      description: 'Chính sách bảo hành lên đến 30 ngày, hỗ trợ thay thế nếu cây không phát triển'
    },
    {
      icon: TrendingUp,
      title: 'Ưu đãi hấp dẫn',
      description: 'Chương trình khuyến mãi thường xuyên, tích điểm đổi quà cho khách hàng thân thiết'
    }
  ];

  return (
    <div>
      <section className="relative bg-gradient-to-br from-green-600 to-green-800 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        {/* Animated background elements */}
        <div 
          className="absolute top-10 left-10 w-20 h-20 bg-green-300 rounded-full opacity-20 animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        ></div>
        <div 
          className="absolute top-32 right-20 w-16 h-16 bg-green-200 rounded-full opacity-30 animate-bounce"
          style={{ transform: `translateY(${scrollY * -0.05}px)` }}
        ></div>
        <div 
          className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-400 rounded-full opacity-25 animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.08}px)` }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`text-center lg:text-left max-w-3xl mx-auto lg:mx-0 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex justify-center lg:justify-start mb-6">
                <Logo size="xl" className="text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Không Gian Xanh
                <br />
                <span className="text-green-200">Cho Mọi Nhà</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-green-100">
                Khám phá bộ sưu tập cây cảnh đa dạng và dịch vụ thiết kế không gian xanh chuyên nghiệp
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/products"
                  className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Mua sắm ngay
                </Link>
                <Link
                  to="/services"
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition-all transform hover:scale-105"
                >
                  Tư vấn thiết kế
                </Link>
              </div>
            </div>
            
            {/* Monstera Plant Image */}
            <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div 
                className="relative transform transition-transform duration-300 hover:scale-105"
                style={{ transform: `translateY(${scrollY * -0.02}px)` }}
              >
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-green-100 to-green-200 p-4">
                  <img
                    src="https://kiengla.vn/wp-content/uploads/2025/03/Monstera_Thai_Constellation_2.jpg"
                    alt="Monstera Thai Constellation variegated plant"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                
                {/* Floating elements around the plant */}
                <div 
                  className="absolute -top-4 -right-4 w-8 h-8 bg-green-300 rounded-full opacity-60 animate-pulse"
                  style={{ transform: `translateY(${scrollY * 0.03}px)` }}
                ></div>
                <div 
                  className="absolute -bottom-6 -left-6 w-6 h-6 bg-green-400 rounded-full opacity-50 animate-bounce"
                  style={{ transform: `translateY(${scrollY * -0.02}px)` }}
                ></div>
                <div 
                  className="absolute top-1/2 -left-8 w-4 h-4 bg-green-200 rounded-full opacity-70 animate-pulse"
                  style={{ transform: `translateY(${scrollY * 0.04}px)` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div 
          className="absolute top-20 right-10 w-32 h-32 bg-green-100 rounded-full opacity-30"
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
        ></div>
        <div 
          className="absolute bottom-20 left-10 w-24 h-24 bg-green-200 rounded-full opacity-20"
          style={{ transform: `translateY(${scrollY * -0.03}px)` }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tại sao chọn GREENNEST?</h2>
            <p className="text-xl text-gray-600">Chúng tôi mang đến trải nghiệm mua sắm và chăm sóc cây tốt nhất</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-green-50 to-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 hover:scale-105 border border-green-100 group"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  transform: `translateY(${scrollY * 0.02}px)`
                }}
              >
                <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-700 transition-colors duration-300 group-hover:scale-110">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">{feature.title}</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-green-50 to-white relative overflow-hidden">
        {/* Floating background elements */}
        <div 
          className="absolute top-10 left-20 w-16 h-16 bg-green-200 rounded-full opacity-40 animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.04}px)` }}
        ></div>
        <div 
          className="absolute bottom-10 right-20 w-20 h-20 bg-green-300 rounded-full opacity-30 animate-bounce"
          style={{ transform: `translateY(${scrollY * -0.06}px)` }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div 
              className="transition-all duration-1000"
              style={{ transform: `translateX(${scrollY * 0.01}px)` }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Dịch vụ thiết kế không gian xanh
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Đội ngũ chuyên gia của chúng tôi sẽ giúp bạn biến không gian sống và làm việc trở nên xanh mát,
                thư giãn và đầy sức sống. Chúng tôi tư vấn và thiết kế dựa trên:
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start group">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mt-1 mr-3 flex-shrink-0 group-hover:bg-green-700 transition-colors">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Phong cách và sở thích cá nhân của bạn</span>
                </li>
                <li className="flex items-start group">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mt-1 mr-3 flex-shrink-0 group-hover:bg-green-700 transition-colors">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Điều kiện ánh sáng và khí hậu của không gian</span>
                </li>
                <li className="flex items-start group">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mt-1 mr-3 flex-shrink-0 group-hover:bg-green-700 transition-colors">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Ngân sách và khả năng chăm sóc của bạn</span>
                </li>
              </ul>
              <Link
                to="/services"
                className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Khám phá dịch vụ
              </Link>
            </div>
            <div 
              className="relative transition-all duration-1000"
              style={{ transform: `translateX(${scrollY * -0.01}px)` }}
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 group">
                <img
                  src="https://images.pexels.com/photos/6069363/pexels-photo-6069363.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Thiết kế không gian xanh"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div 
                className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border-4 border-green-100 hover:border-green-200 transition-all transform hover:scale-105"
                style={{ transform: `translateY(${scrollY * 0.02}px)` }}
              >
                <p className="text-3xl font-bold text-green-600">500+</p>
                <p className="text-gray-600 font-medium">Dự án hoàn thành</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-green-600 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div 
          className="absolute top-10 left-10 w-24 h-24 bg-green-400 rounded-full opacity-20 animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.08}px)` }}
        ></div>
        <div 
          className="absolute bottom-10 right-10 w-32 h-32 bg-green-300 rounded-full opacity-15 animate-bounce"
          style={{ transform: `translateY(${scrollY * -0.05}px)` }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-500 rounded-full opacity-25 animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.06}px)` }}
        ></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 
            className="text-4xl font-bold mb-6 transition-all duration-1000"
            style={{ transform: `translateY(${scrollY * 0.02}px)` }}
          >
            Sẵn sàng tạo không gian xanh của riêng bạn?
          </h2>
          <p 
            className="text-xl mb-8 text-green-100 transition-all duration-1000"
            style={{ transform: `translateY(${scrollY * 0.01}px)` }}
          >
            Bắt đầu hành trình xanh hóa ngôi nhà của bạn ngay hôm nay
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-green-700 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      </section>
    </div>
  );
}
