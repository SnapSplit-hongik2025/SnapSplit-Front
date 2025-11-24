import { FilterState } from "../../type";

type DaySectionProps = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  dayCount: number;
};

function DaySection({ filters, setFilters, dayCount }: DaySectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-body-3 text-grey-1000">여행 일자</p>
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: dayCount }).map((_, i) => (
          <button
            key={i}
            className={`h-[29px] px-3 py-0.75 rounded-[20px] text-body-3 border box-border ${filters.days.includes(i + 1) ? 'bg-primary text-white border-primary' : 'bg-white text-grey-450 border-grey-250'}`}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                days: prev.days.includes(i + 1)
                  ? prev.days.filter((d) => d !== i + 1)
                  : [...prev.days, i + 1],
              }))
            }
          >
            Day {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DaySection;
