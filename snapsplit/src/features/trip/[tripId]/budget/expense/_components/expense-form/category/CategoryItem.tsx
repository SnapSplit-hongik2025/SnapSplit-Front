'use client';

import Image from 'next/image';
import { useExpenseStore } from '@/lib/zustand/useExpenseStore';

type Props = {
  name: string;
};

export default function CategoryItem({ name }: Props) {
  const category = useExpenseStore((s) => s.category);
  const setCategory = useExpenseStore((s) => s.setCategory);

  const toggleCategory = () => {
    if (category === name) {
      setCategory('');
    } else {
      setCategory(name);
    }
  };

  return (
    <button
      onClick={toggleCategory}
      className={`flex-1 flex flex-col items-center pt-1 pb-2.5 rounded-full border-[1px] ${category === name ? 'bg-primary text-white border-primary' : 'border-grey-250'}`}
    >
      <div className="w-8 h-8">
        <Image
          src={category === name ? '/svg/category-example-white.svg' : '/svg/category-example-grey.svg'}
          alt={name}
          width={32}
          height={32}
        />
      </div>
      <div className={`text-caption-1 ${category === name ? 'text-white' : 'text-grey-450'}`}>{name}</div>
    </button>
  );
}
