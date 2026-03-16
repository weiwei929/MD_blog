import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { siteConfig } from '../siteConfig';
import type { Article } from '../types';
import { articles } from '../data';
import AchievementCard from './AchievementCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, RefreshCw } from 'lucide-react';

const weeklyArticles = articles.filter((a) => a.category === 'weekly');

const WeeklyPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(weeklyArticles);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    document.title = `每周复盘 - ${siteConfig.siteName}`;
    let result = weeklyArticles;
    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(term) ||
          a.description.toLowerCase().includes(term) ||
          a.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    }
    setFilteredArticles(result);
    return () => {
      document.title = siteConfig.siteName;
    };
  }, [debouncedSearchTerm]);

  const handleArticleClick = (article: Article) => {
    navigate(`/article/${article.slug || article.id}`);
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm mb-6">
            <Calendar size={16} />
            周报归档
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">每周复盘</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            记录每周工作进展、技术沉淀与思考，持续迭代
          </p>
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <RefreshCw size={14} />
            内容同步自 <code className="bg-gray-100 px-1.5 py-0.5 rounded">.devlog/weekly</code>，运行{' '}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded">npm run sync:weekly</code> 更新
          </p>
        </div>

        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索周报标题、标签..."
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={20} />
            </div>
          </div>
        </div>

        <div className="mb-4 text-gray-600">共 {filteredArticles.length} 篇周报</div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-xl font-medium text-gray-900 mb-2">暂无周报</h3>
            <p className="text-gray-600 mb-4">
              请先运行 <code className="bg-gray-200 px-2 py-1 rounded">npm run sync:weekly</code> 同步周报
            </p>
            <p className="text-sm text-gray-500">
              周报源目录：<code className="bg-gray-100 px-1 rounded">D:\workspace\.devlog\weekly</code>
            </p>
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
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  layout
                >
                  <AchievementCard
                    article={article}
                    onClick={() => handleArticleClick(article)}
                    showDelete={false}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};

export default WeeklyPage;
