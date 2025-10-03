import { useState } from 'react';
import { Send, Bot, Phone, Mail, MapPin, Clock, CheckCircle2, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export default function Services() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Chào bạn! 👋 Tôi là AI tư vấn của GREENNEST. Tôi có thể giúp bạn về:\n\n🌿 Thiết kế cảnh quan\n🌱 Chăm sóc cây cảnh\n🏠 Thiết kế không gian xanh\n💰 Báo giá dịch vụ\n\nBạn cần tư vấn về dịch vụ nào?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'Tôi hiểu bạn quan tâm đến dịch vụ này. Để tư vấn chi tiết, bạn có thể:\n\n📞 Gọi hotline: 0867976303\n📧 Email: info@greennest.vn\n📍 Đến trực tiếp: BS8 - The Beverly Solari, Vinhomes Grand Park',
        'Dịch vụ này rất phù hợp với nhu cầu của bạn! Chúng tôi có:\n\n✅ Tư vấn miễn phí\n✅ Thiết kế 3D minh họa\n✅ Bảo hành cây trồng 30 ngày\n\nBạn muốn đặt lịch tư vấn không?',
        'Cảm ơn bạn đã quan tâm! Để được tư vấn chi tiết, bạn có thể:\n\n1️⃣ Mô tả không gian hiện tại\n2️⃣ Chia sẻ ngân sách dự kiến\n3️⃣ Đặt lịch khảo sát miễn phí\n\nTôi có thể giúp gì thêm cho bạn?',
        'Tuyệt vời! Chúng tôi có nhiều gói dịch vụ phù hợp:\n\n🌱 Gói cơ bản: 2-5 triệu\n🌿 Gói tiêu chuẩn: 5-15 triệu\n🌳 Gói cao cấp: 15-50 triệu\n\nBạn quan tâm gói nào?'
      ];

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { text: 'Tư vấn thiết kế cảnh quan', icon: '🌿' },
    { text: 'Chăm sóc cây cảnh', icon: '🌱' },
    { text: 'Báo giá dịch vụ', icon: '💰' },
    { text: 'Đặt lịch khảo sát', icon: '📅' }
  ];

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
              <Bot className="w-8 h-8 text-white" />
            </div>
            <Sparkles className="w-8 h-8 text-yellow-300" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">AI Tư vấn GREENNEST</h1>
          <p className="text-xl md:text-2xl text-green-100">Trợ lý thông minh cho không gian xanh của bạn</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Chat Header */}
              <div className="bg-green-600 text-white p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">AI Tư vấn GREENNEST</h2>
                      <p className="text-green-100 text-sm">Trực tuyến • Sẵn sàng hỗ trợ</p>
                    </div>
                  </div>
              </div>

              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.type === 'bot' && (
                          <Bot className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <p className={`text-xs mt-2 ${
                            message.type === 'user' ? 'text-green-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-2xl">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-5 h-5 text-green-600" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

                {/* Quick Actions */}
                <div className="p-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">Hành động nhanh:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => setInputMessage(action.text)}
                        className="px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100 transition-colors flex items-center space-x-1"
                      >
                        <span>{action.icon}</span>
                        <span>{action.text}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Nhập tin nhắn của bạn..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
            </div>
          </div>

          {/* Service Info Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Liên hệ trực tiếp</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Hotline</p>
                    <a href="tel:0867976303" className="text-green-600 hover:text-green-700">
                      0867976303
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <a href="mailto:info@greennest.vn" className="text-green-600 hover:text-green-700">
                      info@greennest.vn
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Địa chỉ</p>
                    <p className="text-gray-600 text-sm">
                      BS8 - The Beverly Solari<br />
                      Vinhomes Grand Park, Q9
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Giờ làm việc</p>
                    <p className="text-gray-600 text-sm">
                      T2-T6: 8:00-18:00<br />
                      T7: 8:00-12:00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Features */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Dịch vụ của chúng tôi</h3>
              <div className="space-y-3">
                {[
                  'Thiết kế cảnh quan chuyên nghiệp',
                  'Tư vấn chọn cây phù hợp',
                  'Chăm sóc cây cảnh định kỳ',
                  'Thiết kế không gian xanh',
                  'Báo giá miễn phí',
                  'Bảo hành cây trồng 30 ngày'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Thống kê</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm text-green-100">Khách hàng</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-sm text-green-100">Dự án</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">95%</div>
                  <div className="text-sm text-green-100">Hài lòng</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">5+</div>
                  <div className="text-sm text-green-100">Năm KN</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}