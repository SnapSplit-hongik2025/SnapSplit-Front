import Image from 'next/image';
import unCheckedIcon from '@public/svg/check_grey.svg';
import CheckedIcon from '@public/svg/check-green.svg';

type TripDay = {
  day: number;
  hasExpense: boolean;
  settled: boolean;
};

export interface DatePickButtonSheetProps {
  tripDay?: TripDay[];
  selectedIndex: number | null;
  setSelectedIndex: (idx: number) => void;
  onClose?: () => void;
}

export default function DatePickButtonSheet({
  tripDay,
  selectedIndex,
  setSelectedIndex,
  onClose,
}: DatePickButtonSheetProps) {
  console.log('tripDay : ' + tripDay);
  return (
    <div className="flex w-full flex-col justify-start">
      {tripDay?.map(({ day, settled }, idx) => (
        <button
          className="flex w-full gap-1 justify-start py-3 cursor-pointer disabled:cursor-default"
          key={day}
          aria-label="날짜 선택"
          disabled={!settled}
          onClick={() => {
            if (!settled) return;
            setSelectedIndex(idx);
            if (onClose) onClose();
          }}
        >
          <Image src={selectedIndex === idx ? CheckedIcon : unCheckedIcon} alt="Check Icon" />
          <span
            className={
              !settled ? 'text-grey-450 cursor-not-allowed' : selectedIndex === idx ? 'text-primary' : 'text-grey-1000'
            }
          >
            {day === 0 ? '여행 준비' : `Day ${day}`}
          </span>
        </button>
      ))}
    </div>
  );
}
