import { memo } from 'react';
import type { CategoryId } from '../types';
import { categories } from '../data';

type Props = {
  selectedCategory: CategoryId;
  onCategoryChange: (category: CategoryId) => void;
};

const CategoryFilter = memo(({ selectedCategory, onCategoryChange }: Props) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {categories.map((category) => (
        <button
          key={category.id}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === category.id
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => onCategoryChange(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
});

export default CategoryFilter;
