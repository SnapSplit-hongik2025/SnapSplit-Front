'use client';

import { EXPENSE_CATEGORY } from '@/shared/constants/expense';
import CategoryItem from './category/CategoryItem';

type Props = {
  category: string;
  setCategory: (category: string) => void;
};

export default function CategorySection({ category, setCategory }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto w-full">
      {EXPENSE_CATEGORY.map((item) => (
        <CategoryItem
          key={item.backendName}
          id={item.backendName}
          name={item.name}
          category={category}
          setCategory={setCategory}
          iconOn={item.iconOn}
          iconOff={item.iconOff}
        />
      ))}
    </div>
  );
}
