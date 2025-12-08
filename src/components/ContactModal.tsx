import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Github, Twitter, Facebook, MessageCircle, Send } from 'lucide-react';
import { siteConfig } from '../siteConfig';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
    const socialLinks = [
    {
      name: 'Email',
      icon: <Mail size={24} />,
      link: `mailto:${siteConfig.social.email}`,
      color: 'hover:text-red-500',
      label: siteConfig.social.email
    },
    {
      name: 'X (Twitter)',
      icon: <Twitter size={24} />,
      link: siteConfig.social.x,
      color: 'hover:text-black',
      label: '@pennfly'
    },
    {
      name: '微信公众号',
      icon: <MessageCircle size={24} />,
      link: '#',
      color: 'hover:text-green-600',
      label: siteConfig.siteName
    },
    {
      name: 'Github',
      icon: <Github size={24} />,
      link: siteConfig.social.github,
      color: 'hover:text-gray-900',
      label: '@pennfly'
    },
    {
      name: 'Discord',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="lucide">
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z"/>
        </svg>
      ),
      link: siteConfig.social.discord,
      color: 'hover:text-indigo-500',
      label: 'Join Server'
    },
    {
      name: 'Facebook',
      icon: <Facebook size={24} />,
      link: siteConfig.social.facebook,
      color: 'hover:text-blue-600',
      label: 'Pennfly Page'
    },
    {
      name: 'Telegram',
      icon: <Send size={24} />,
      link: siteConfig.social.telegram,
      color: 'hover:text-sky-500',
      label: '@pennfly'
    },
    {
      name: 'Notion',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="lucide">
          <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28.047-.28L16.226.29C16.04.197 15.806 0 15.48 0H4.972c-.466 0-.7.326-.7.7v2.892c0 .327.187.615.187.615zM.7 4.628C.233 4.628 0 4.86 0 5.327v17.505c0 .466.28.7.7.7h13.903c.466 0 .7-.28.7-.7V14.198l.047-.373 7.835-6.905c.466 0 .816-.373.816-.84V2.15c0-.466-.35-.7-.816-.7-.28 0-.513.187-.513.187l-7.835 6.905-.047.373V5.327c0-.466-.233-.7-.7-.7H.7z"/>
        </svg>
      ),
      link: siteConfig.social.notion,
      color: 'hover:text-gray-700',
      label: 'Public Workspace'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          />
          
          {/* 模态框内容 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl z-[70] p-6 m-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-2 border-b border-gray-50">
              <h2 className="text-2xl font-bold text-gray-900">与我联系</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {socialLinks.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center p-3 rounded-xl hover:bg-gray-50 transition-all group border border-gray-100 hover:border-gray-200`}
                >
                  <div className={`mr-4 text-gray-400 transition-colors ${item.color}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.label}</div>
                  </div>
                  <div className="text-gray-300 group-hover:text-gray-900 transition-colors">
                    →
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-6 text-center text-sm text-gray-400">
              期待与您的交流！
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
