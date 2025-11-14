import Image from 'next/image';

type Props = {
  onClose: () => void;
  date: string;
  handleSelectDate: (dayIndex: number) => void;
  daysCount: number;
};

export default function DateSelectSheet({ onClose, date, handleSelectDate, daysCount }: Props) {
  const days = Array.from({ length: daysCount }, (_, index) => index + 1);

  const calculateDate = (dayIndex: number): string => {
    const start = new Date(date);
    const next = new Date(start.setDate(start.getDate() + dayIndex - 1));
    return next.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  };

  return (
    <div className="flex flex-col items-center w-full">
      {days.map((option) => (
        <button
          key={option}
          onClick={() => {
            handleSelectDate(option);
            onClose();
          }}
          className={`flex items-center gap-1 w-full py-3 text-body-3 ${date === calculateDate(option) ? 'text-primary' : 'text-grey-1000'}`}
        >
          {date === calculateDate(option) ? (
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
