'use client';

import React from 'react';

type CategorySectionProps = {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
};

export default function CategorySection({ selectedCategory, onSelectCategory }: CategorySectionProps) {
  const toggleCategory = (category: string) => {
    if (category === selectedCategory) {
      onSelectCategory(null);
    } else {
      onSelectCategory(category);
    }
  };
  return (
    <div className="flex flex-col pt-7 gap-3 text-body-2">
      <div className="">경비 형태</div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => toggleCategory('cash')}
          className={`rounded-xl w-full h-12 px-5 ${selectedCategory === 'cash' ? 'bg-primary text-white' : 'bg-white text-black border border-grey-350'}`}
        >
          현금
        </button>
        <button
          onClick={() => toggleCategory('card')}
          className={`rounded-xl w-full h-12 px-5 ${selectedCategory === 'card' ? 'bg-primary text-white' : 'bg-white text-black border border-grey-350'}`}
        >
          카드
        </button>
      </div>
    </div>
  );
}
