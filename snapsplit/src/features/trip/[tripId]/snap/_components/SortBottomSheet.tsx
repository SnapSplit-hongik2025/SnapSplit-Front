'use client';

import Image from 'next/image';

interface SortBottomSheetProps {
  selectedSort: 'date_desc' | 'date_asc';
  onSelectSort: (option: 'date_desc' | 'date_asc') => void;
  onClose: () => void;
}

const sortOptions = ['date_desc', 'date_asc'];

export default function SortBottomSheet({ selectedSort, onSelectSort, onClose }: SortBottomSheetProps) {
  return (
    <div className="flex flex-col items-center w-full">
      <ul className="w-full">
        {sortOptions.map((option) => (
          <button
            key={option}
            onClick={() => {
              onSelectSort(option as 'date_desc' | 'date_asc');
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
            <span className={`${selectedSort === option ? 'text-body-1 text-green' : 'text-body-3 text-grey-1000'}`}>{option === 'date_desc' ? '최신순' : '오래된순'}</span>
          </button>
        ))}
      </ul>
    </div>
  );
}
