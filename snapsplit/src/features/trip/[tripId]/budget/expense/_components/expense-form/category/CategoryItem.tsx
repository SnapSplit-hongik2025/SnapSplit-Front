'use client';

import Image from 'next/image';

type Props = {
  id: string;
  name: string;
  category: string;
  setCategory: (category: string) => void;
  // [추가] 아이콘 경로 props
  iconOn: string;
  iconOff: string;
};

export default function CategoryItem({ id, name, category, setCategory, iconOn, iconOff }: Props) {
  const isSelected = category === id;

  const toggleCategory = () => {
    if (isSelected) {
      setCategory('');
    } else {
      setCategory(id);
    }
  };

  return (
    <button
      onClick={toggleCategory}
      className={`flex-1 cursor-pointer flex flex-col items-center pt-1 pb-2.5 rounded-full border-[1px] transition-colors duration-200 ${
        isSelected ? 'bg-primary text-white border-primary' : 'bg-white border-grey-250 text-grey-450'
      }`}
    >
      <div className="w-8 h-8 relative mt-1 items-center flex justify-center">
        <Image src={isSelected ? iconOn : iconOff} alt={name} width={28} height={28} />
      </div>
      <div className="text-caption-1">{name}</div>
    </button>
  );
}
