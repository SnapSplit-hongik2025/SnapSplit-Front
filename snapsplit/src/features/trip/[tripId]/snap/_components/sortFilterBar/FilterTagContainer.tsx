import { FilterState } from '../../type';
import FilterTag from './FilterTag';
import Image from 'next/image';

type FilterTagContainerProps = {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
};

function FilterTagContainer({ filters, setFilters }: FilterTagContainerProps) {
  const isTagExist = filters.days.length > 0 || filters.people.length > 0;

  if (!isTagExist) {
    return null;
  } else {
    const sortedDays = [...filters.days].sort((a, b) => a - b);
    const sortedPeople = [...filters.people].sort((a, b) => a.localeCompare(b));

    const generateLabel = (data: string[] | number[]) => {
      if (data.length === 1) {
        return data[0];
      } else if (data.length === 2) {
        return `${data[0]}, ${data[1]}`;
      } else {
        return `${data[0]}, ${data[1]} 외 ${data.length - 2}`;
      }
    };

    return (
      <div className="flex-1 flex items-center gap-1.5 min-h-8">
        <button
          onClick={() => setFilters({ days: [], people: [], locations: [] })}
          className="flex-shrink-0 flex justify-center items-center bg-primary w-7 h-7 rounded-full"
        >
          <Image src="/svg/refresh.svg" alt="refresh" width={12} height={12} />
        </button>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          {sortedDays.length > 0 && <FilterTag label={`Day ${generateLabel(sortedDays)}`} />}
          {sortedPeople.length > 0 && <FilterTag label={`${generateLabel(sortedPeople)}`} />}
        </div>
      </div>
    );
  }
}

export default FilterTagContainer;
