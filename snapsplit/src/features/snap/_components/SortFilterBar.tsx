import Image from 'next/image';

interface SortFilterBarProps {
  selectedSort: string;
  onSortOpen: () => void;
  onFilterOpen: () => void;
}

export default function SortFilterBar({ selectedSort, onSortOpen, onFilterOpen }: SortFilterBarProps) {
  return (
    <div className="flex justify-between items-center p-4 text-sm">
      <button onClick={onSortOpen} className="flex gap-1">{selectedSort} <Image src="/svg/bottomArrow.svg" alt="bottomArrow" width={16} height={16} /></button>
      <button onClick={onFilterOpen}>
        <Image
          src="/svg/filter.svg"
          alt="filter"
          width={24}
          height={24}
        />
      </button>
    </div>
  );
}