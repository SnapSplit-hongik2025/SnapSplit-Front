import { FilterState } from "../../type";
import FilterTag from "./FilterTag";
import Image from "next/image";

type FilterTagContainerProps = {
    filters: FilterState;
}

function FilterTagContainer({ filters }: FilterTagContainerProps) {
    const isTagExist = filters.days.length > 0 || filters.people.length > 0 || filters.locations.length > 0;

    return (
      <>
        {isTagExist && (
          <div className="flex gap-1.5 pb-3">
            <button className="flex justify-center items-center bg-grey-450 w-7 h-7 rounded-full">
              <Image src="/svg/refresh.svg" alt="refresh" width={12} height={12} />
            </button>
            {filters.days.length > 0 && (
              <FilterTag label={`Day ${filters.days.join(', ')}`} />
            )}
            {filters.people.length > 0 && (
              <FilterTag label={filters.people.join(', ')} />
            )}
            {filters.locations.length > 0 && (
              <FilterTag label={filters.locations.join(', ')} />
            )}
          </div>
        )}
      </>
    );
}

export default FilterTagContainer;