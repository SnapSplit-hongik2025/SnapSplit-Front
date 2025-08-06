import Image from 'next/image';

type Props = {
  onClose: () => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
};

const DATE_OPTIONS = [
  { value: 'Day 1', label: 'Day 1' },
  { value: 'Day 2', label: 'Day 2' },
  { value: 'Day 3', label: 'Day 3' },
  { value: 'Day 4', label: 'Day 4' },
  { value: 'Day 5', label: 'Day 5' },
  { value: 'Day 6', label: 'Day 6' },
];

export default function DateSelectSheet({ onClose, selectedDate, setSelectedDate }: Props) {
  return (
    <div className="flex flex-col items-center w-full">
      {DATE_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => {
            setSelectedDate(option.value);
            onClose();
          }}
          className={`flex items-center gap-1 w-full py-3 text-body-3 ${selectedDate === option.value ? 'text-primary' : 'text-grey-1000'}`}
        >
          {selectedDate === option.value ? (
            <Image src="/svg/check-green.svg" alt="selected" width={24} height={24} />
          ) : (
            <Image src="/svg/check_grey.svg" alt="unselected" width={24} height={24} />
          )}
          <div className="flex-1 text-body-3 text-start">{option.label}</div>
        </button>
      ))}
    </div>
  );
}
