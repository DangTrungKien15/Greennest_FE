import { Product, Service, Transaction } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Cây Kim Tiền',
    description: 'Cây phong thủy mang lại may mắn, dễ chăm sóc, phù hợp văn phòng',
    price: 250000,
    image: 'https://images.pexels.com/photos/6208086/pexels-photo-6208086.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Cây phong thủy',
    stock: 50,
    rating: 4.8
  },
  {
    id: '2',
    name: 'Cây Monstera',
    description: 'Cây trồng trong nhà, lá xẻ độc đáo, tạo điểm nhấn cho không gian',
    price: 350000,
    image: 'https://images.pexels.com/photos/3125195/pexels-photo-3125195.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Cây trong nhà',
    stock: 30,
    rating: 4.9
  },
  {
    id: '3',
    name: 'Cây Lưỡi Hổ',
    description: 'Cây lọc không khí hiệu quả, dễ sống, ít cần chăm sóc',
    price: 150000,
    image: 'https://images.pexels.com/photos/7084309/pexels-photo-7084309.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Cây lọc không khí',
    stock: 100,
    rating: 4.7
  },
  {
    id: '4',
    name: 'Cây Trầu Bà',
    description: 'Cây leo trang trí, lá xanh mướt, phù hợp với nhiều không gian',
    price: 180000,
    image: 'https://images.pexels.com/photos/4503269/pexels-photo-4503269.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Cây leo',
    stock: 45,
    rating: 4.6
  },
  {
    id: '5',
    name: 'Cây Phát Tài',
    description: 'Cây phong thủy đẹp, tượng trưng cho sự phát đạt và thịnh vượng',
    price: 450000,
    image: 'https://images.pexels.com/photos/6208087/pexels-photo-6208087.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Cây phong thủy',
    stock: 25,
    rating: 4.9
  },
  {
    id: '6',
    name: 'Cây Xương Rồng',
    description: 'Cây sa mạc dễ trồng, chịu hạn tốt, phù hợp bàn làm việc',
    price: 120000,
    image: 'https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Cây sa mạc',
    stock: 80,
    rating: 4.5
  },
  {
    id: '7',
    name: 'Cây Thiết Mộc Lan',
    description: 'Cây thủy sinh đẹp, lọc không khí tốt, tạo điểm nhấn xanh',
    price: 200000,
    image: 'https://images.pexels.com/photos/7084297/pexels-photo-7084297.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Cây thủy sinh',
    stock: 40,
    rating: 4.8
  },
  {
    id: '8',
    name: 'Cây Cọ',
    description: 'Cây nhiệt đới, tạo không gian resort, phù hợp sân vườn',
    price: 800000,
    image: 'https://images.pexels.com/photos/2123337/pexels-photo-2123337.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Cây ngoài trời',
    stock: 15,
    rating: 4.7
  },
  {
    id: '9',
    name: 'Cây Sen Đá',
    description: 'Cây mini đáng yêu, dễ chăm sóc, phù hợp bàn làm việc',
    price: 80000,
    image: 'https://images.pexels.com/photos/3223132/pexels-photo-3223132.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Cây mini',
    stock: 120,
    rating: 4.6
  },
  {
    id: '10',
    name: 'Cây Bonsai Tùng',
    description: 'Cây cảnh nghệ thuật, phong cách Nhật Bản, đẳng cấp',
    price: 1200000,
    image: 'https://images.pexels.com/photos/6208083/pexels-photo-6208083.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Bonsai',
    stock: 10,
    rating: 5.0
  },
  {
    id: '11',
    name: 'Cây Dương Xỉ',
    description: 'Cây treo đẹp, lá xanh mướt, tạo không gian thư giãn',
    price: 220000,
    image: 'https://images.pexels.com/photos/5699809/pexels-photo-5699809.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Cây treo',
    stock: 35,
    rating: 4.7
  },
  {
    id: '12',
    name: 'Cây Hạnh Phúc',
    description: 'Cây phong thủy, mang lại niềm vui và hạnh phúc cho gia đình',
    price: 380000,
    image: 'https://images.pexels.com/photos/7084408/pexels-photo-7084408.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Cây phong thủy',
    stock: 28,
    rating: 4.8
  }
];

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Tư vấn thiết kế cơ bản',
    description: 'Tư vấn bố trí cây cảnh cho không gian nhỏ như ban công, bàn làm việc',
    price: 500000,
    image: 'https://images.pexels.com/photos/6913382/pexels-photo-6913382.jpeg?auto=compress&cs=tinysrgb&w=600',
    duration: '2-3 giờ'
  },
  {
    id: '2',
    name: 'Thiết kế không gian xanh phòng khách',
    description: 'Thiết kế và bố trí cây cảnh cho phòng khách, tạo điểm nhấn xanh mát',
    price: 1500000,
    image: 'https://images.pexels.com/photos/6969866/pexels-photo-6969866.jpeg?auto=compress&cs=tinysrgb&w=600',
    duration: '1 ngày'
  },
  {
    id: '3',
    name: 'Thiết kế vườn nhỏ',
    description: 'Thiết kế sân vườn nhỏ với cây cảnh và tiểu cảnh đẹp mắt',
    price: 3000000,
    image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=600',
    duration: '2-3 ngày'
  },
  {
    id: '4',
    name: 'Thiết kế không gian xanh văn phòng',
    description: 'Bố trí cây xanh cho văn phòng, cải thiện môi trường làm việc',
    price: 5000000,
    image: 'https://images.pexels.com/photos/6476589/pexels-photo-6476589.jpeg?auto=compress&cs=tinysrgb&w=600',
    duration: '3-5 ngày'
  },
  {
    id: '5',
    name: 'Thiết kế vườn treo tường',
    description: 'Tạo vườn đứng tiết kiệm không gian, độc đáo và ấn tượng',
    price: 4000000,
    image: 'https://images.pexels.com/photos/7061662/pexels-photo-7061662.jpeg?auto=compress&cs=tinysrgb&w=600',
    duration: '2-3 ngày'
  },
  {
    id: '6',
    name: 'Chăm sóc cây định kỳ',
    description: 'Dịch vụ chăm sóc, tưới nước, bón phân định kỳ hàng tuần',
    price: 800000,
    image: 'https://images.pexels.com/photos/7728889/pexels-photo-7728889.jpeg?auto=compress&cs=tinysrgb&w=600',
    duration: '1 tháng'
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    amount: 1000000,
    description: 'Nạp tiền vào ví',
    date: '2025-09-28T10:30:00',
    status: 'completed'
  },
  {
    id: '2',
    type: 'purchase',
    amount: -250000,
    description: 'Mua Cây Kim Tiền',
    date: '2025-09-27T14:20:00',
    status: 'completed'
  },
  {
    id: '3',
    type: 'purchase',
    amount: -350000,
    description: 'Mua Cây Monstera',
    date: '2025-09-26T16:45:00',
    status: 'completed'
  },
  {
    id: '4',
    type: 'deposit',
    amount: 500000,
    description: 'Nạp tiền vào ví',
    date: '2025-09-25T09:15:00',
    status: 'completed'
  },
  {
    id: '5',
    type: 'purchase',
    amount: -1500000,
    description: 'Dịch vụ thiết kế không gian xanh phòng khách',
    date: '2025-09-24T11:00:00',
    status: 'completed'
  }
];
