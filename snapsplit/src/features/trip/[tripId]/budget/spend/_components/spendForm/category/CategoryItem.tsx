import Image from 'next/image';

type Props = {
  name: string;
};

export default function CategoryItem({ name }: Props) {
  return (
    <button className="flex-1 flex flex-col items-center pt-1 pb-2.5 rounded-full border-[1px] border-grey-250">
      <div className="w-8 h-8">
        <Image src="/svg/category-example-grey.svg" alt="category" width={32} height={32} />
      </div>
      <div className="text-grey-450 text-caption-1">{name}</div>
    </button>
  );
}
