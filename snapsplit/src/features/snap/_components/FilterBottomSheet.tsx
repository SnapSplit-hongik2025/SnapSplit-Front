import { FilterState } from "@/features/snap/type";

interface FilterBottomSheetProps {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    onClose: () => void;
  }
  
  export default function FilterBottomSheet({ filters, setFilters, onClose }: FilterBottomSheetProps) {
    // 테스트 데이터
    const people = ['유빈', '지수', '나경', '연수'];
    const locations = ['런던', '파리', '취리히'];
  
    return (
      <div className="fixed bottom-0 w-full bg-white border-t rounded-t-xl p-4 shadow-xl">
        <p className="font-semibold mb-2">여행 일자</p>
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <button
            key={i}
            className={`px-3 py-1 border rounded-full ${filters.days.includes(i + 1) ? 'bg-black text-white' : ''}`}
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
        <p className="font-semibold mt-4 mb-2">사람</p>
        <div className="flex gap-2 flex-wrap">
          {people.map(name => (
            <button key={name} className={`border px-3 py-1 rounded-full ${filters.people.includes(name) ? 'bg-black text-white' : ''}`} onClick={() =>
              setFilters((prev) => ({
                ...prev,
                people: prev.people.includes(name)
                  ? prev.people.filter((p) => p !== name)
                  : [...prev.people, name],
              }))
            }>{name}</button>
          ))}
        </div>
        <p className="font-semibold mt-4 mb-2">장소</p>
        <div className="flex gap-2 flex-wrap">
          {locations.map(loc => (
            <button key={loc} className={`border px-3 py-1 rounded-full ${filters.locations.includes(loc) ? 'bg-black text-white' : ''}`} onClick={() =>
              setFilters((prev) => ({
                ...prev,
                locations: prev.locations.includes(loc)
                  ? prev.locations.filter((l) => l !== loc)
                  : [...prev.locations, loc],
              }))
            }>{loc}</button>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="text-grey-450" onClick={() => setFilters({ days: [], people: [], locations: [] })}>초기화</button>
          <button
            className="bg-black text-white px-4 py-1 rounded-full"
            onClick={onClose}
          >
            확인
          </button>
        </div>
      </div>
    );
  }
  