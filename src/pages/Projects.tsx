import { useState } from 'react';
import { Eye, MapPin, Calendar, DollarSign, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Project {
  id: number;
  title: string;
  location: string;
  date: string;
  priceRange: string;
  style: string;
  image: string;
  area?: string;
}

export default function Projects() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const projects: Project[] = [
    {
      id: 1,
      title: "Căn hộ hiện đại Landmark 81",
      location: "Quận 1, TP.HCM",
      date: "Tháng 3, 2024",
      priceRange: "500-800 triệu",
      style: "Hiện đại",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop&crop=center",
      area: "85m²"
    },
    {
      id: 2,
      title: "Villa sinh thái",
      location: "Quận 2, TP.HCM",
      date: "Tháng 2, 2024",
      priceRange: "1-2 tỷ",
      style: "Sinh thái",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=400&fit=crop&crop=center",
      area: "200m²"
    },
    {
      id: 3,
      title: "Nhà phố tối giản Bình Thạnh",
      location: "Quận Bình Thạnh, TP.HCM",
      date: "Tháng 1, 2024",
      priceRange: "800 triệu - 1 tỷ",
      style: "Tối giản",
      image: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=500&h=400&fit=crop&crop=center",
      area: "120m²"
    },
    {
      id: 4,
      title: "Biệt thự cao cấp Thủ Đức",
      location: "Quận Thủ Đức, TP.HCM",
      date: "Tháng 12, 2023",
      priceRange: "2-3 tỷ",
      style: "Hiện đại",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop&crop=center",
      area: "250m²"
    },
    {
      id: 5,
      title: "Căn hộ sinh thái Quận 7",
      location: "Quận 7, TP.HCM",
      date: "Tháng 11, 2023",
      priceRange: "600-900 triệu",
      style: "Sinh thái",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&h=400&fit=crop&crop=center",
      area: "95m²"
    },
    {
      id: 6,
      title: "Nhà vườn tối giản Củ Chi",
      location: "Huyện Củ Chi, TP.HCM",
      date: "Tháng 10, 2023",
      priceRange: "400-600 triệu",
      style: "Tối giản",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=400&fit=crop&crop=center",
      area: "150m²"
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'Tất cả dự án' },
    { value: 'area-small', label: 'Diện tích nhỏ (<100m²)' },
    { value: 'area-medium', label: 'Diện tích vừa (100-200m²)' },
    { value: 'area-large', label: 'Diện tích lớn (>200m²)' },
    { value: 'style-modern', label: 'Phong cách hiện đại' },
    { value: 'style-eco', label: 'Phong cách sinh thái' },
    { value: 'style-minimal', label: 'Phong cách tối giản' },
    { value: 'budget-low', label: 'Ngân sách 300-800 triệu' },
    { value: 'budget-medium', label: 'Ngân sách 800 triệu - 2 tỷ' },
    { value: 'budget-high', label: 'Ngân sách trên 2 tỷ' }
  ];

  const filteredProjects = projects.filter(project => {
    if (selectedFilter === 'all') return true;
    
    // Area filters
    if (selectedFilter === 'area-small' && project.area && parseInt(project.area) < 100) return true;
    if (selectedFilter === 'area-medium' && project.area && parseInt(project.area) >= 100 && parseInt(project.area) <= 200) return true;
    if (selectedFilter === 'area-large' && project.area && parseInt(project.area) > 200) return true;
    
    // Style filters
    if (selectedFilter === 'style-modern' && project.style === 'Hiện đại') return true;
    if (selectedFilter === 'style-eco' && project.style === 'Sinh thái') return true;
    if (selectedFilter === 'style-minimal' && project.style === 'Tối giản') return true;
    
    // Budget filters
    if (selectedFilter === 'budget-low' && project.priceRange.includes('500-800') || project.priceRange.includes('600-900')) return true;
    if (selectedFilter === 'budget-medium' && (project.priceRange.includes('800 triệu - 1 tỷ') || project.priceRange.includes('1-2 tỷ'))) return true;
    if (selectedFilter === 'budget-high' && project.priceRange.includes('2-3 tỷ')) return true;
    
    return false;
  });

  const searchedProjects = filteredProjects;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white py-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&h=1080&fit=crop&crop=center')`
          }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Dự án GreenNest</h1>
          <p className="text-xl md:text-2xl text-green-100">Không gian xanh - Sống khỏe mạnh</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Section */}
        <div className="mb-8">
          <div className="relative inline-block">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-6 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {searchedProjects.map(project => (
            <div key={project.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
              <div className="relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {project.area && (
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-gray-800">{project.area}</span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                  {project.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{project.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">{project.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span className="text-sm">{project.priceRange}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Tag className="w-4 h-4 mr-2" />
                    <span className="text-sm">{project.style}</span>
                  </div>
                </div>
                
                <Link 
                  to={`/projects/${project.id}`}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Xem chi tiết</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {searchedProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Không tìm thấy dự án nào phù hợp</p>
          </div>
        )}
      </div>

    </div>
  );
}
