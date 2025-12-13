import { memo, useState } from 'react';
import { Image as ImageIcon, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Article } from '../types';
import { categories } from '../data';

type Props = {
  article: Article;
  onClick: () => void;
  onDelete: (article: Article) => void;
};

const AchievementCard = memo(({ article, onClick, onDelete }: Props) => {
  const category = categories.find(cat => cat.id === article.category);
  const [imageError, setImageError] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(article);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="h-full"
      onClick={onClick}
    >
      <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col cursor-pointer group">
        <div className="relative">
          <div className="h-48 overflow-hidden bg-gray-100 relative">
            {!imageError && article.coverImage ? (
              <img
                src={article.coverImage.startsWith('/') ? import.meta.env.BASE_URL + article.coverImage.slice(1) : article.coverImage}
                alt={article.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className={`w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-gray-100 to-gray-200`}>
                <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center mb-3 backdrop-blur-sm">
                  <ImageIcon size={24} className="text-gray-400" />
                </div>
                <span className="text-sm font-medium text-gray-500 line-clamp-2 px-4">
                  {article.title}
                </span>
              </div>
            )}
          </div>
          {article.featured && (
            <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
              精选
            </div>
          )}
          <div className={`absolute top-4 left-4 ${category?.color} text-white text-xs font-bold px-2 py-1 rounded`}>
            {category?.name}
          </div>
        </div>

        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-xl font-bold mb-2 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">{article.title}</h3>
          <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{article.description}</p>

          <div className="flex flex-wrap gap-1 mt-auto mb-3">
            {article.tags.slice(0, 3).map((tag: string, index: number) => (
              <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center text-sm pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3 text-gray-500">
              <span>{article.date}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleDeleteClick}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
                title="删除文章"
              >
                <Trash2 size={18} />
              </button>
              <button className="text-gray-900 font-medium hover:text-blue-600 flex items-center gap-1 transition-colors">
                阅读全文 →
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default AchievementCard;
