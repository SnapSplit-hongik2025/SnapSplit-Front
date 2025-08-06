'use client';

import CategoryItem from './category/CategoryItem';
import { SPEND_CATEGORY } from '@/shared/constants/spend';
import { useState } from 'react';

export default function CategorySection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-start w-full gap-3">
      <div className="text-body-3">지출 카테고리</div>
      <div className="flex items-center gap-2 w-full">
        {SPEND_CATEGORY.map((category) => (
          <CategoryItem key={category.name} name={category.name} selectedCategory={selectedCategory} setSelectedCategory={() => setSelectedCategory(category.name)} />
        ))}
      </div>
    </div>
  );
}
