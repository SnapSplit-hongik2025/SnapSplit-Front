'use client';

import Image from 'next/image';

type Props = {
  id: string;
  name: string;
  category: string;
  setCategory: (category: string) => void;
};

export default function CategoryItem({ id, name, category, setCategory }: Props) {
  const toggleCategory = () => {
    if (category === id) {
      setCategory('');
    } else {
      setCategory(id);
    }
  };

  return (
    <button
      onClick={toggleCategory}
      className={`flex-1 flex flex-col items-center pt-1 pb-2.5 rounded-full border-[1px] ${category === id ? 'bg-primary text-white border-primary' : 'border-grey-250'}`}
    >
      <div className="w-8 h-8">
        <Image
          src={category === id ? '/svg/category-example-white.svg' : '/svg/category-example-grey.svg'}
          alt={name}
          width={32}
          height={32}
        />
      </div>
      <div className={`text-caption-1 ${category === id ? 'text-white' : 'text-grey-450'}`}>{name}</div>
    </button>
  );
}
