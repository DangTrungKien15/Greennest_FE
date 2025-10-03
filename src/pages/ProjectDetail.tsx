import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, DollarSign, Tag, Users, Home, TreePine, Zap } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  location: string;
  date: string;
  priceRange: string;
  style: string;
  image: string;
  area?: string;
  description?: string;
  features?: string[];
  images?: string[];
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  // Fake data - trong thực tế sẽ fetch từ API
  const projects: Project[] = [
    {
      id: 1,
      title: "Căn hộ hiện đại Landmark 81",
      location: "Quận 1, TP.HCM",
      date: "Tháng 3, 2024",
      priceRange: "500-800 triệu",
      style: "Hiện đại",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center",
      area: "85m²",
      description: "Thiết kế căn hộ hiện đại với không gian mở, tận dụng tối đa ánh sáng tự nhiên và tạo cảm giác rộng rãi. Sử dụng vật liệu thân thiện với môi trường và hệ thống thông gió tự nhiên.",
      features: [
        "Thiết kế không gian mở",
        "Hệ thống thông gió tự nhiên",
        "Vật liệu thân thiện môi trường",
        "Tận dụng ánh sáng tự nhiên",
        "Hệ thống tưới tự động",
        "Cây xanh trong nhà"
      ],
      images: [
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&crop=center"
      ]
    },
    {
      id: 2,
      title: "Villa sinh thái",
      location: "Quận 2, TP.HCM",
      date: "Tháng 2, 2024",
      priceRange: "1-2 tỷ",
      style: "Sinh thái",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center",
      area: "200m²",
      description: "Villa sinh thái với thiết kế hài hòa với thiên nhiên, sử dụng năng lượng mặt trời và hệ thống tái chế nước. Không gian sống xanh và bền vững.",
      features: [
        "Hệ thống năng lượng mặt trời",
        "Tái chế nước thải",
        "Vườn rau sạch",
        "Hệ thống làm mát tự nhiên",
        "Vật liệu tái chế",
        "Cảnh quan sinh thái"
      ],
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center"
      ]
    },
    {
      id: 3,
      title: "Nhà phố tối giản Bình Thạnh",
      location: "Quận Bình Thạnh, TP.HCM",
      date: "Tháng 1, 2024",
      priceRange: "800 triệu - 1 tỷ",
      style: "Tối giản",
      image: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop&crop=center",
      area: "120m²",
      description: "Thiết kế tối giản với không gian sạch sẽ, tập trung vào công năng và sự đơn giản. Sử dụng màu sắc trung tính và vật liệu tự nhiên.",
      features: [
        "Thiết kế tối giản",
        "Không gian đa chức năng",
        "Vật liệu tự nhiên",
        "Màu sắc trung tính",
        "Tối ưu không gian",
        "Cây xanh trang trí"
      ],
      images: [
        "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&crop=center"
      ]
    }
  ];

  useEffect(() => {
    const projectId = parseInt(id || '1');
    const foundProject = projects.find(p => p.id === projectId);
    setProject(foundProject || projects[0]);
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/projects" 
              className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Quay lại dự án</span>
            </Link>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Dự án</span>
              <span className="text-sm text-gray-400">/</span>
              <span className="text-sm font-medium text-gray-900">{project.title}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 bg-gray-200">
        <img
          src={project.images?.[selectedImage] || project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
          <div className="flex items-center space-x-4 text-lg">
            <div className="flex items-center space-x-1">
              <MapPin className="w-5 h-5" />
              <span>{project.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-5 h-5" />
              <span>{project.date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      {project.images && project.images.length > 1 && (
        <div className="bg-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-4 overflow-x-auto">
              {project.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-green-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${project.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Project Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Mô tả dự án</h2>
              <p className="text-gray-600 leading-relaxed">{project.description}</p>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tính năng nổi bật</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.features?.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <TreePine className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Project Details */}
          <div className="space-y-6">
            {/* Project Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Thông tin dự án</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Địa điểm</span>
                  </div>
                  <span className="font-medium text-gray-900">{project.location}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Thời gian</span>
                  </div>
                  <span className="font-medium text-gray-900">{project.date}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Ngân sách</span>
                  </div>
                  <span className="font-medium text-gray-900">{project.priceRange}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <Tag className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Phong cách</span>
                  </div>
                  <span className="font-medium text-gray-900">{project.style}</span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center space-x-3">
                    <Home className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Diện tích</span>
                  </div>
                  <span className="font-medium text-gray-900">{project.area}</span>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-green-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Liên hệ tư vấn</h3>
              <p className="text-green-100 mb-6">
                Bạn quan tâm đến dự án này? Hãy liên hệ với chúng tôi để được tư vấn chi tiết.
              </p>
              <div className="space-y-3">
                <button className="w-full bg-white text-green-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Gọi ngay: 0867976303
                </button>
                <button className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors">
                  Đặt lịch tư vấn
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Thống kê</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">95%</div>
                  <div className="text-sm text-gray-600">Khách hàng hài lòng</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">50+</div>
                  <div className="text-sm text-gray-600">Dự án hoàn thành</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">5</div>
                  <div className="text-sm text-gray-600">Năm kinh nghiệm</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">24/7</div>
                  <div className="text-sm text-gray-600">Hỗ trợ khách hàng</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
