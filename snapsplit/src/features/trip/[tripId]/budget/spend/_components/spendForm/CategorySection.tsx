import CategoryItem from './category/CategoryItem';
import SPEND_CATEGORY from '@/shared/constants/spendCategory';

export default function CategorySection() {
  return (
    <div className="flex flex-col items-start w-full gap-3">
      <div className="text-body-3">지출 카테고리</div>
      <div className="flex items-center gap-2 w-full">
        {SPEND_CATEGORY.map((category) => (
          <CategoryItem key={category.name} name={category.name} />
        ))}
      </div>
    </div>
  );
}
