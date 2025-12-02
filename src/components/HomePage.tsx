import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CategoryId, Article } from '../types';
import { articles } from '../data';
import AchievementCard from './AchievementCard';
import CategoryFilter from './CategoryFilter';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(articles);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // 简单防抖：300ms 更新搜索词
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    let result = articles;
    
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

  return (
    <>
      {/* 文章列表部分 */}
      <section id="articles" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">最新文章</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              探索技术世界，分享开发经验与心得
            </p>
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
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default HomePage;
