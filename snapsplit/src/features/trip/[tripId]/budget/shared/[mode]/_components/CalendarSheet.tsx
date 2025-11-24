import BottomSheet from "@/shared/components/bottom-sheet/BottomSheet";
import Calendar from "@/shared/components/Calendar";

const CalendarSheet = ({
  isOpen,
  onClose,
  selectedDate,
  setSelectedDate,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <Calendar mode="single" selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      <button 
        onClick={() => {
          onClose();
          // TODO: selectedDate 전달
        }}
        className="w-full h-13 rounded-2xl bg-primary text-label-2 text-white"
      >
        선택하기
      </button>
    </BottomSheet>
  );
};

export default CalendarSheet;
