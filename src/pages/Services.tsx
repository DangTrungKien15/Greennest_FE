import { Clock, CheckCircle2 } from 'lucide-react';
import { mockServices } from '../data/mockData';

export default function Services() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Dịch vụ tư vấn thiết kế</h1>
          <p className="text-xl text-green-100">
            Biến không gian của bạn thành ốc đảo xanh với sự hỗ trợ của chuyên gia
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Quy trình làm việc</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Tư vấn', desc: 'Gặp gỡ và trao đổi nhu cầu' },
              { step: '2', title: 'Khảo sát', desc: 'Đo đạc và đánh giá không gian' },
              { step: '3', title: 'Thiết kế', desc: 'Lên phương án và báo giá' },
              { step: '4', title: 'Triển khai', desc: 'Thi công và bàn giao' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {mockServices.map(service => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-gray-700">{service.duration}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.name}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>Tư vấn miễn phí ban đầu</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>Thiết kế 3D minh họa</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>Bảo hành cây trồng 30 ngày</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500">Giá từ</p>
                    <p className="text-3xl font-bold text-green-600">
                      {service.price.toLocaleString('vi-VN')}đ
                    </p>
                  </div>

                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                    Đặt lịch tư vấn
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Cần tư vấn riêng cho dự án của bạn?</h2>
          <p className="text-lg text-green-100 mb-6">
            Liên hệ với chúng tôi để nhận báo giá và tư vấn chi tiết cho không gian của bạn
          </p>
          <button className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-all transform hover:scale-105 shadow-lg">
            Liên hệ ngay
          </button>
        </div>
      </div>
    </div>
  );
}
