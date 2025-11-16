import Image from 'next/image';

type Props = {
  onClose: () => void;
  selectedDayIndex: number;
  handleSelectDate: (dayIndex: number) => void;
  daysCount: number;
};

export default function DateSelectSheet({ onClose, selectedDayIndex, handleSelectDate, daysCount }: Props) {
  // "Day 0"을 포함하도록 수정
  const days = Array.from({ length: daysCount + 1 }, (_, index) => index);

  return (
    <div className="flex flex-col items-center w-full">
      {days.map((option) => (
        <button
          key={option}
          onClick={() => {
            handleSelectDate(option);
            onClose();
          }}
          className={`flex items-center gap-1 w-full py-3 text-body-3 ${selectedDayIndex === option ? 'text-primary' : 'text-grey-1000'}`}
        >
          {selectedDayIndex === option ? (
            <Image src="/svg/check-green.svg" alt="selected" width={24} height={24} />
          ) : (
            <Image src="/svg/check_grey.svg" alt="unselected" width={24} height={24} />
          )}
          <div className="flex-1 text-body-3 text-start">Day {option}</div>
        </button>
      ))}
    </div>
  );
}
