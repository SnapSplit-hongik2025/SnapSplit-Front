import { FilterState } from '@/features/trip/[tripId]/snap/type';
import DaySection from './DaySection';
import PeopleSection from './PeopleSection';
import ButtonSection from './ButtonSection';

interface FilterBottomSheetProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onClose: () => void;
  tab: string;
}

export default function FilterBottomSheet({ filters, setFilters, onClose, tab }: FilterBottomSheetProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <DaySection filters={filters} setFilters={setFilters} />

      {tab === 'base' && <PeopleSection filters={filters} setFilters={setFilters} />}

      <ButtonSection onClose={onClose} setFilters={setFilters}/>
    </div>
  );
}
