import Image from 'next/image';

type Props = {
  onClose: () => void;
  selectedDayIndex: number;
  handleSelectDate: (dayIndex: number) => void;
  daysCount: number;
  settledDayIndices: number[];
};

export default function DateSelectSheet({
  onClose,
  selectedDayIndex,
  handleSelectDate,
  daysCount,
  settledDayIndices,
}: Props) {
  const days = Array.from({ length: daysCount + 1 }, (_, index) => index);

  return (
    <div className="flex flex-col items-center w-full pb-8">
      {days.map((option) => {
        const isSettled = settledDayIndices.includes(option);
        const isSelected = selectedDayIndex === option;

        return (
          <button
            key={option}
            disabled={isSettled}
            onClick={() => {
              handleSelectDate(option);
              onClose();
            }}
            className={`flex items-center gap-1 w-full py-3 text-body-3 transition-colors
              ${isSettled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-grey-100'}
              ${isSelected ? 'text-primary' : isSettled ? 'text-grey-400' : 'text-grey-1000'}
            `}
          >
            {isSelected ? (
              <Image src="/svg/check-green.svg" alt="selected" width={24} height={24} />
            ) : (
              <Image src="/svg/check_grey.svg" alt="unselected" width={24} height={24} />
            )}

            <div className="flex-1 text-start flex items-center gap-2">
              {/* [수정] option(index)이 0이면 '여행 준비', 아니면 'Day N' 표시 */}
              <span>{option === 0 ? '여행 준비' : `Day ${option}`}</span>

              {isSettled && <span className="text-xs text-grey-400">(정산 완료)</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
