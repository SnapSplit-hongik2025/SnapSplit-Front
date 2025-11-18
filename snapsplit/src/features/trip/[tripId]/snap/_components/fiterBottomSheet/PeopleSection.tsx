import { FilterState } from "../../type";

type PeopleSectionProps = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  members: string[];
};

function PeopleSection({ filters, setFilters, members }: PeopleSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-body-3 text-grey-1000">사람</p>
      <div className="flex gap-2 flex-wrap">
        {members.map(name => (
          <button
            key={name}
            className={`px-3 py-0.75 rounded-[20px] text-body-3 h-[29px] border box-border ${filters.people.includes(name) ? 'bg-primary text-white border-primary' : 'bg-white text-grey-450 border-grey-250'}`}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                people: prev.people.includes(name)
                  ? prev.people.filter((p) => p !== name)
                  : [...prev.people, name],
              }))
            }
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PeopleSection;
