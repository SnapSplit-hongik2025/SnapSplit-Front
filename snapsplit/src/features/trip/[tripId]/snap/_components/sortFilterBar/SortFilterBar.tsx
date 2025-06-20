import Image from 'next/image';
import { FilterState } from '../../type';
import FilterTagContainer from './FilterTagContainer';

interface SortFilterBarProps {
  selectedSort: string;
  onSortOpen: () => void;
  onFilterOpen: () => void;
  filters: FilterState;
}

export default function SortFilterBar({ selectedSort, onSortOpen, onFilterOpen, filters }: SortFilterBarProps) {
  return (
    <div className="flex justify-between items-center text-body-2">
      <div className="flex flex-col">
        <FilterTagContainer filters={filters} />
        <button onClick={onSortOpen} className="flex gap-1">{selectedSort} <Image src="/svg/bottomArrow.svg" alt="bottomArrow" width={16} height={16} /></button>
      </div>
      <button 
        onClick={onFilterOpen}
        className="self-start"
      >
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