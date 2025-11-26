import Image from 'next/image';

type Props = {
  onClose: () => void;
  selectedDayIndex: number;
  handleSelectDate: (dayIndex: number) => void;
  daysCount: number;
  settledDayIndices: number[]; // [추가]
};

export default function DateSelectSheet({
  onClose,
  selectedDayIndex,
  handleSelectDate,
  daysCount,
  settledDayIndices, // [추가]
}: Props) {
  const days = Array.from({ length: daysCount }, (_, index) => index + 1);

  return (
    <div className="flex flex-col items-center w-full">
      {days.map((option) => {
        // [추가] 현재 날짜가 정산 완료된 날짜인지 확인
        const isSettled = settledDayIndices.includes(option);
        const isSelected = selectedDayIndex === option;

        return (
          <button
            key={option}
            // [추가] 정산된 날짜면 버튼 비활성화
            disabled={isSettled}
            onClick={() => {
              handleSelectDate(option);
              onClose();
            }}
            // [수정] 정산된 날짜일 경우 스타일 변경 (커서, 색상 등)
            className={`flex items-center gap-1 w-full py-3 text-body-3 
              ${isSettled ? 'opacity-50' : 'cursor-pointer'}
              ${isSelected ? 'text-primary' : isSettled ? 'text-grey-400' : 'text-grey-1000'}
            `}
          >
            {/* 아이콘 표시 로직 */}
            {isSelected ? (
              <Image src="/svg/check-green.svg" alt="selected" width={24} height={24} />
            ) : (
              <Image src="/svg/check_grey.svg" alt="unselected" width={24} height={24} />
            )}

            <div className="flex-1 text-start flex items-center gap-2">
              <span>Day {option}</span>
              {/* [추가] 정산 완료 시 텍스트 표시 (선택 사항) */}
              {isSettled && <span className="text-xs text-grey-400">(정산 완료)</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
