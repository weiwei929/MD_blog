import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { articles, categories } from './data';
import HomePage from './components/HomePage';
import ArticleDetail from './components/ArticleDetail';
import { motion } from 'framer-motion';
import { BookOpen, Zap, FileText, Palette, Menu, X, ArrowRight, Github, Twitter, Mail } from 'lucide-react';
import ContactModal from './components/ContactModal';
import PreviewPage from './components/PreviewPage';

// 英雄区域组件
const HeroSection = () => {
  return (
    <section className="bg-white text-gray-900 py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Available for hire
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight text-gray-900">
            我的技术博客
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-12 text-gray-500 font-light leading-relaxed">
            分享技术见解，记录成长历程。探索代码的艺术，追求极致的用户体验。
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <div className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl p-8 flex-1 max-w-xs">
              <div className="text-4xl font-bold mb-2 text-gray-900">{articles.length}</div>
              <div className="text-gray-500 font-medium">原创文章</div>
            </div>
            <div className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl p-8 flex-1 max-w-xs">
              <div className="text-4xl font-bold mb-2 text-gray-900">{categories.length - 1}</div>
              <div className="text-gray-500 font-medium">文章分类</div>
            </div>
            <div className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl p-8 flex-1 max-w-xs">
              <div className="text-4xl font-bold mb-2 text-gray-900">{articles.reduce((sum, a) => sum + a.tags.length, 0)}</div>
              <div className="text-gray-500 font-medium">技术标签</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

//关于部分组件
const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">关于博客</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            这是一个使用 React + TypeScript + Vite + Tailwind CSS 构建的现代化博客平台，
            支持 Markdown 文章、代码高亮、图片/视频展示等丰富功能。
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6 text-gray-900">
              <Zap size={24} />
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-900">极速开发</h3>
            <p className="text-gray-500 leading-relaxed">Vite + HMR 提供闪电般的开发体验，让创意瞬间落地。</p>
          </div>
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6 text-gray-900">
              <FileText size={24} />
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-900">Markdown 优先</h3>
            <p className="text-gray-500 leading-relaxed">原生支持 Markdown 写作与渲染，专注于内容创作本身。</p>
          </div>
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6 text-gray-900">
              <Palette size={24} />
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-900">精美设计</h3>
            <p className="text-gray-500 leading-relaxed">Tailwind CSS 打造现代化界面，简约而不简单。</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// 页脚组件
const Footer = ({ simple = false }: { simple?: boolean }) => {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-600 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {!simple && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-6">
              <div className="bg-gray-900 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">
                <BookOpen size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight text-gray-900">Pennfly 创新实验室</span>
                <span className="text-xs font-normal text-gray-500">Flying X studio</span>
              </div>
            </div>
            <p className="text-gray-500 mb-6 leading-relaxed">
              专注于前沿技术探索与创新，推动数字世界的无限可能。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">产品服务</h3>
            <ul className="space-y-3">
              {['GLM大模型', 'CodeGeeX', 'WiseModel', 'AI开放平台'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">解决方案</h3>
            <ul className="space-y-3">
              {['金融行业', '医疗健康', '教育培训', '智能制造'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">联系我们</h3>
            <ul className="space-y-3 text-gray-500">
              <li>contact@pennfly.com</li>
              <li>400-123-4567</li>
              <li>北京市海淀区中关村</li>
            </ul>
          </div>
          </div>
        )}
        
        <div className={`${simple ? '' : 'border-t border-gray-100 mt-12 pt-8'} flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm`}>
          <p>© 2025 Flying X studio. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-600">隐私政策</a>
            <a href="#" className="hover:text-gray-600">服务条款</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// 导航栏组件
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  
  const navItems = [
    { name: '首页', href: '/' },
    { name: '文章', href: '/articles' },
    { name: '关于', href: '/about' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center group">
                <div className="bg-gray-900 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3 group-hover:bg-gray-800 transition-colors">
                  <BookOpen size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg leading-tight text-gray-900">Pennfly 创新实验室</span>
                  <span className="text-xs font-normal text-gray-500 font-normal">Flying X studio</span>
                </div>
              </Link>
            </div>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              {navItems.map((item) => (
                item.href.startsWith('/#') ? (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </nav>
          </div>
          
          <div className="hidden md:flex items-center">
            <button 
              onClick={() => setIsContactOpen(true)}
              className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all shadow-sm hover:shadow-md flex items-center gap-2"
            >
              与我联系 <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-500 hover:text-gray-900 focus:outline-none p-2"
              aria-label={mobileMenuOpen ? '关闭菜单' : '打开菜单'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b border-gray-100">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="pt-4 pb-3 border-t border-gray-100">
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsContactOpen(true);
                }}
                className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                与我联系 <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 联系模态框 */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </header>
  );
};

// 主应用组件 - 路由容器
const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={
              <>
                <HeroSection />
                <Footer />
              </>
            } />
            <Route path="/articles" element={
              <>
                <HomePage />
                <Footer simple />
              </>
            } />
            <Route path="/about" element={
              <>
                <AboutSection />
                <Footer />
              </>
            } />
            <Route path="/article/:slug" element={
              <>
                <ArticleDetail />
                <Footer simple />
              </>
            } />
            <Route path="/preview" element={
              <>
                <PreviewPage />
                <Footer simple />
              </>
            } />
          </Routes>
        </main>
        
        
      </div>
    </BrowserRouter>
  );
};

export default App;
