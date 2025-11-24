import { FilterState } from '@/features/trip/[tripId]/snap/type';
import DaySection from './DaySection';
import PeopleSection from './PeopleSection';
import ButtonSection from './ButtonSection';

interface FilterBottomSheetProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onClose: () => void;
  tab: string;
  dayCount: number;
  members?: string[];
}

export default function FilterBottomSheet({ filters, setFilters, onClose, tab, dayCount, members }: FilterBottomSheetProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <DaySection filters={filters} setFilters={setFilters} dayCount={dayCount} />

      {tab === 'base' && <PeopleSection filters={filters} setFilters={setFilters} members={members ?? []} />}

      <ButtonSection onClose={onClose} setFilters={setFilters}/>
    </div>
  );
}
