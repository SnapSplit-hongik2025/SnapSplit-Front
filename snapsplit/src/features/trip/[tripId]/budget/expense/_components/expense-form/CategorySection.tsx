'use client';

import CategoryItem from './category/CategoryItem';
import { EXPENSE_CATEGORY } from '@/shared/constants/expense';

type Props = {
  category: string;
  setCategory: (category: string) => void;
};

export default function CategorySection({ category, setCategory }: Props) {
  return (
    <div className="flex flex-col items-start w-full gap-3">
      <div className="text-body-3">지출 카테고리</div>
      <div className="flex items-center gap-2 w-full">
        {EXPENSE_CATEGORY.map((c) => (
          <CategoryItem key={c.backendName} id={c.backendName} name={c.name} category={category} setCategory={setCategory} />
        ))}
      </div>
    </div>
  );
}
