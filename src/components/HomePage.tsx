import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { siteConfig } from '../siteConfig';
import type { CategoryId, Article } from '../types';
import { articles } from '../data';
import AchievementCard from './AchievementCard';
import CategoryFilter from './CategoryFilter';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, PenSquare, AlertTriangle } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(articles);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // 删除确认模态框状态
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    article: Article | null;
  }>({
    isOpen: false,
    article: null,
  });

  // 简单防抖：300ms 更新搜索词
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    let result = articles;
    
    // Set default title
    document.title = siteConfig.siteName;
    
    if (selectedCategory !== 'all') {
      result = result.filter(article => article.category === selectedCategory);
    }
    
    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      result = result.filter(
        article => 
          article.title.toLowerCase().includes(term) || 
          article.description.toLowerCase().includes(term) ||
          article.tags.some((tag: string) => tag.toLowerCase().includes(term))
      );
    }
    
    setFilteredArticles(result);
  }, [selectedCategory, debouncedSearchTerm]);

  const handleCategoryChange = (category: CategoryId) => {
    setSelectedCategory(category);
  };

  const handleArticleClick = (article: Article) => {
    navigate(`/article/${article.slug || article.id}`);
  };

  const handleDeleteClick = (article: Article) => {
    setDeleteModal({
      isOpen: true,
      article,
    });
  };

  const confirmDelete = async () => {
    const articleToDelete = deleteModal.article;
    if (!articleToDelete) return;

    // 检查浏览器是否支持 File System Access API
    if (!('showDirectoryPicker' in window)) {
      alert('您的浏览器不支持直接删除文件功能 (File System Access API)。\n请尝试使用最新版本的 Chrome 或 Edge 浏览器。');
      setDeleteModal({ isOpen: false, article: null });
      return;
    }

    try {
      // File System Access API
      const dirHandle = await window.showDirectoryPicker({
        mode: 'readwrite',
        startIn: 'documents',
      });

      // 尝试查找文件
      const filename = `${articleToDelete.slug}.md`;
      
      try {
        await dirHandle.removeEntry(filename);
        
        // 删除成功，更新列表
        setFilteredArticles(prev => prev.filter(a => a.id !== articleToDelete.id));
        // 注意：这里只是更新了当前视图的列表，实际上还需要一种机制来更新全局 articles 数据，
        // 但由于 articles 是从 data.ts 导入的静态/动态混合数据，我们至少先在 UI 上移除它。
        // 如果是纯静态站点，刷新后可能会回来（除非后端文件真删了且构建系统重新扫描）。
        // 在这个本地开发模式下，文件被删除了，Vite HMR 可能会触发重载，或者下次加载时 markdownLoader 找不到文件。
        
        alert(`文章 "${articleToDelete.title}" 已成功删除！`);
      } catch (err: any) {
        if (err.name === 'NotFoundError') {
          alert(`删除失败：在所选目录中找不到文件 "${filename}"。\n请确保你选择了正确的 "src/posts" 目录。`);
        } else {
          throw err;
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Deletion failed:', err);
        alert(`删除操作失败：${err.message}`);
      }
    } finally {
      setDeleteModal({ isOpen: false, article: null });
    }
  };

  return (
    <>
      {/* 文章列表部分 */}
      <section id="articles" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">最新文章</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              探索技术世界，分享开发经验与心得
            </p>
            <button
              onClick={() => navigate('/preview')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
            >
              <PenSquare size={18} />
              发布新文章
            </button>
          </div>
          
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索文章、标签或关键词..."
                className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent shadow-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={20} />
              </div>
            </div>
          </div>
          
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
          
          <div className="mb-4 text-gray-600">
            显示 {filteredArticles.length} 篇文章
          </div>
          
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-300 mb-4 flex justify-center"><Search size={48} /></div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">未找到匹配的文章</h3>
              <p className="text-gray-600">请尝试其他搜索词或筛选条件</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    layout
                  >
                    <AchievementCard 
                      article={article}
                      onClick={() => handleArticleClick(article)}
                      onDelete={handleDeleteClick}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* 删除确认模态框 */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden p-6"
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">确认删除？</h3>
                <p className="text-gray-600 text-sm mb-4">
                  您确定要删除文章 <span className="font-bold text-gray-900">"{deleteModal.article?.title}"</span> 吗？
                </p>
                
                <div className="bg-gray-50 rounded-lg p-3 w-full mb-4 text-left">
                  <div className="text-xs text-gray-500 mb-1">即将删除文件：</div>
                  <div className="font-mono text-sm text-gray-800 break-all">
                    src/posts/{deleteModal.article?.slug}.md
                  </div>
                </div>

                <div className="text-left bg-amber-50 rounded-lg p-3 text-sm text-amber-800 mb-6 space-y-2">
                  <p className="font-bold">⚠️ 注意事项：</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>此操作将尝试通过浏览器 API 删除本地文件。</li>
                    <li>由于缓存或权限原因，<strong>刷新页面后文章可能会重新出现</strong>。</li>
                    <li><strong>彻底删除方法：</strong>如本功能无效，请直接在项目目录 <code className="bg-amber-100 px-1 rounded">src/posts</code> 中手动删除对应的 <code className="bg-amber-100 px-1 rounded">.md</code> 文件。</li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ isOpen: false, article: null })}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium transition-colors shadow-md hover:shadow-lg"
                >
                  确认删除
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HomePage;
