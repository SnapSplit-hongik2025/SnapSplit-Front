'use client';

import CategoryItem from './category/CategoryItem';
import { EXPENSE_CATEGORY } from '@/shared/constants/expense';

export default function CategorySection() {
  return (
    <div className="flex flex-col items-start w-full gap-3">
      <div className="text-body-3">지출 카테고리</div>
      <div className="flex items-center gap-2 w-full">
        {EXPENSE_CATEGORY.map((category) => (
          <CategoryItem key={category.name} name={category.name} />
        ))}
      </div>
    </div>
  );
}
