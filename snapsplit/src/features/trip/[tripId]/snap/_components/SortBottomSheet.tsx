'use client';

import Image from 'next/image';

interface SortBottomSheetProps {
  selectedSort: string;
  onSelectSort: (option: string) => void;
  onClose: () => void;
}

const sortOptions = ['최신순', '시간순'];

export default function SortBottomSheet({ selectedSort, onSelectSort, onClose }: SortBottomSheetProps) {
  return (
    <div className="flex flex-col items-center w-full">
      <ul className="w-full">
        {sortOptions.map((option) => (
          <button
            key={option}
            onClick={() => {
              onSelectSort(option);
              onClose();
            }}
            className="flex items-center justify-start py-3 gap-1"
          >
            <span>
              {selectedSort === option ? (
                <Image src="/svg/check-green.svg" alt="check" width={24} height={24} unoptimized />
              ) : (
                <Image src="/svg/check_grey.svg" alt="check" width={24} height={24} unoptimized />
              )}
            </span>
            <span className={`${selectedSort === option ? 'text-body-1 text-green' : 'text-body-3 text-grey-1000'}`}>{option}</span>
          </button>
        ))}
      </ul>
    </div>
  );
}
