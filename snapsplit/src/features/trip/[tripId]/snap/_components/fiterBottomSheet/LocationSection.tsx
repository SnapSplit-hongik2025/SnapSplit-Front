import { FilterState } from "../../type";

function LocationSection({ filters, setFilters }: { filters: FilterState; setFilters: React.Dispatch<React.SetStateAction<FilterState>> }) {
  const locations = ['런던', '파리', '취리히'];

  return (
    <div className="flex flex-col gap-2">
      <p className="text-body-3 text-grey-1000">장소</p>
      <div className="flex gap-2 flex-wrap">
        {locations.map(loc => (
          <button
            key={loc}
            className={`px-3 py-0.75 rounded-[20px] text-body-3 h-[29px] border box-border ${filters.locations.includes(loc) ? 'bg-primary text-white border-primary' : 'bg-white text-grey-450 border-grey-250'}`}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                locations: prev.locations.includes(loc)
                  ? prev.locations.filter((l) => l !== loc)
                  : [...prev.locations, loc],
              }))
            }
          >
            {loc}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LocationSection;