import Image from 'next/image';
import { FilterState } from '../../type';
import FilterTagContainer from './FilterTagContainer';

interface SortFilterBarProps {
  selectedSort: 'date_desc' | 'date_asc';
  onSortOpen: () => void;
  onFilterOpen: () => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  onSortChange?: (sort: 'date_desc' | 'date_asc') => void;
}

export default function SortFilterBar({ selectedSort, onSortOpen, onFilterOpen, filters, setFilters, onSortChange }: SortFilterBarProps) {
  const handleSortClick = () => {
    if (onSortChange) {
      onSortChange(selectedSort === 'date_desc' ? 'date_asc' : 'date_desc');
    } else {
      onSortOpen();
    }
  };

  return (
    <div className="display-fixed display-w-full z-10">
      <div className="flex items-center justify-between gap-2 w-full mb-auto px-5 py-4">
        <div className="flex flex-col gap-3">
          <FilterTagContainer filters={filters} setFilters={setFilters} />
          <button
            onClick={handleSortClick}
            className="self-start flex items-center h-8 text-body-2 pl-3 pr-1 py-1 rounded-full bg-white border-1 border-grey-250"
          >
            {selectedSort === 'date_desc' ? '최신순' : '오래된순'} <Image src="/svg/arrow-bottom.svg" alt="arrowBottom" width={24} height={24} />
          </button>
        </div>
        <button
          onClick={onFilterOpen}
          className="self-start flex-shrink-0 flex items-center w-8 h-8 p-1 bg-white rounded-full border-1 border-grey-250"
        >
          <Image src="/svg/filter-grey-650.svg" alt="filter" width={24} height={24} />
        </button>
      </div>
    </div>
  );
}
