import Image from 'next/image';

type Props = {
  name: string;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
};

export default function CategoryItem({ name, selectedCategory, setSelectedCategory }: Props) {

  const toggleCategory = () => {
    if (selectedCategory === name) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(name);
    }
  };

  return (
    <button
      onClick={toggleCategory}
      className={`flex-1 flex flex-col items-center pt-1 pb-2.5 rounded-full ${selectedCategory === name ? 'bg-primary text-white' : 'border-[1px] border-grey-250'}`}
    >
      <div className="w-8 h-8">
        <Image src={selectedCategory === name ? "/svg/category-example-white.svg" : "/svg/category-example-grey.svg"} alt="category" width={32} height={32} />
      </div>
      <div className={`text-caption-1 ${selectedCategory === name ? 'text-white' : 'text-grey-450'}`}>{name}</div>
    </button>
  );
}
