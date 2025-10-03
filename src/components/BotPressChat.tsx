import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    botpressWebChat?: {
      init: (config: any) => void;
      sendEvent: (event: any) => void;
      hide: () => void;
      show: () => void;
    };
  }
}

export default function BotPressChat() {
  const location = useLocation();
  const isServicesPage = location.pathname === '/services';

  useEffect(() => {
    // Wait for BotPress to be loaded
    const initBotPress = () => {
      if (window.botpressWebChat) {
        window.botpressWebChat.init({
          composerPlaceholder: 'Nhập tin nhắn của bạn...',
          botConversationDescription: 'Chào bạn! Tôi là AI tư vấn của GREENNEST. Tôi có thể giúp bạn về:',
          botId: 'greennest-ai',
          hostUrl: 'https://cdn.botpress.cloud/webchat/v3.3',
          // Custom styling
          stylesheet: `
            .bp-widget-container {
              z-index: 9999 !important;
            }
            .bp-widget-button {
              background-color: #16a34a !important;
              border-radius: 50% !important;
            }
            .bp-widget-button:hover {
              background-color: #15803d !important;
            }
            .bp-widget-header {
              background-color: #16a34a !important;
            }
            .bp-widget-send-button {
              background-color: #16a34a !important;
            }
            .bp-widget-send-button:hover {
              background-color: #15803d !important;
            }
          `,
          // Custom configuration
          enableConversationDeletion: true,
          enableTranscriptDownload: true,
          enablePersistentMenu: true,
          persistentMenu: [
            {
              type: 'nested',
              title: '🌿 Dịch vụ',
              menuItems: [
                {
                  type: 'postback',
                  title: 'Tư vấn thiết kế',
                  payload: 'CONSULTATION_DESIGN'
                },
                {
                  type: 'postback',
                  title: 'Chăm sóc cây cảnh',
                  payload: 'PLANT_CARE'
                },
                {
                  type: 'postback',
                  title: 'Báo giá dịch vụ',
                  payload: 'QUOTATION'
                }
              ]
            },
            {
              type: 'nested',
              title: '📞 Liên hệ',
              menuItems: [
                {
                  type: 'postback',
                  title: 'Hotline: 0867976303',
                  payload: 'CALL_HOTLINE'
                },
                {
                  type: 'postback',
                  title: 'Email: info@greennest.vn',
                  payload: 'SEND_EMAIL'
                },
                {
                  type: 'postback',
                  title: 'Địa chỉ',
                  payload: 'ADDRESS_INFO'
                }
              ]
            },
            {
              type: 'nested',
              title: 'ℹ️ Thông tin',
              menuItems: [
                {
                  type: 'postback',
                  title: 'Giới thiệu GREENNEST',
                  payload: 'ABOUT_GREENNEST'
                },
                {
                  type: 'postback',
                  title: 'Dự án tiêu biểu',
                  payload: 'FEATURED_PROJECTS'
                },
                {
                  type: 'postback',
                  title: 'Hướng dẫn sử dụng',
                  payload: 'USER_GUIDE'
                }
              ]
            }
          ],
          // Welcome message
          welcomeScreen: {
            message: 'Chào bạn! 👋 Tôi là AI tư vấn của GREENNEST. Tôi có thể giúp bạn về thiết kế cảnh quan, chăm sóc cây cảnh và các dịch vụ khác. Bạn cần hỗ trợ gì?',
            typingDelay: 1000
          },
          // Custom data
          customData: {
            company: 'GREENNEST',
            website: 'https://greennest.vn',
            phone: '0867976303',
            email: 'info@greennest.vn',
            address: 'BS8 - The Beverly Solari, Vinhomes Grand Park, Quận 9, TP.HCM'
          }
        });

        // Hide chat widget on Services page
        if (isServicesPage) {
          setTimeout(() => {
            const widget = document.querySelector('.bp-widget-container');
            if (widget) {
              (widget as HTMLElement).style.display = 'none';
            }
          }, 1000);
        }
      } else {
        // Retry after 1 second if BotPress is not loaded yet
        setTimeout(initBotPress, 1000);
      }
    };

    // Initialize BotPress after a short delay to ensure DOM is ready
    setTimeout(initBotPress, 2000);

    // Cleanup function
    return () => {
      // BotPress doesn't provide a cleanup method, but we can hide the widget
      const widget = document.querySelector('.bp-widget-container');
      if (widget) {
        (widget as HTMLElement).style.display = 'none';
      }
    };
  }, [isServicesPage]);

  // Handle route changes to show/hide chat widget
  useEffect(() => {
    const widget = document.querySelector('.bp-widget-container');
    if (widget) {
      if (isServicesPage) {
        (widget as HTMLElement).style.display = 'none';
      } else {
        (widget as HTMLElement).style.display = 'block';
      }
    }
  }, [isServicesPage]);

  return null; // This component doesn't render anything visible
}
