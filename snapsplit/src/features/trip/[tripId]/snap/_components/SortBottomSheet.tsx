'use client';

interface SortBottomSheetProps {
  selectedSort: string;
  onSelectSort: (option: string) => void;
  onClose: () => void;
}

const sortOptions = ['최신순', '이름순', '좋아요순'];

export default function SortBottomSheet({
  selectedSort,
  onSelectSort,
  onClose,
}: SortBottomSheetProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg p-4 z-50">
      <div className="text-base font-semibold mb-4">정렬</div>
      <ul className="space-y-3">
        {sortOptions.map(option => (
          <button
            key={option}
            onClick={() => {
              onSelectSort(option);
              onClose();
            }}
            className="flex items-center cursor-pointer"
          >
            <span className="mr-2">
              {selectedSort === option ? '✓' : ''}
            </span>
            <span className={selectedSort === option ? 'font-medium text-black' : 'text-grey-650'}>
              {option}
            </span>
          </button>
        ))}
      </ul>
    </div>
  );
}
