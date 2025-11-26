import Image from 'next/image';
import { deleteImages } from '@/features/trip/[tripId]/snap/api/snap-api';
type SelectModeActionBarProps = {
  selectedCount: number;
  tripId: number;
  photoIds: number[];
  onDownload?: () => void;
  onDelete?: () => void;
};

const SelectModeActionBar = ({ selectedCount, tripId, photoIds, onDownload, onDelete }: SelectModeActionBarProps) => {
  const handleDelete = async () => {
    await deleteImages(tripId, photoIds);
    onDelete?.();
  };
  return (
    <div className="flex-shrink-0 flex items-center justify-between h-14 px-5 py-4 bg-grey-850">
      <button className="cursor-pointer" onClick={onDownload}>
        <Image src="/svg/download.svg" alt="다운로드" width={24} height={24} />
      </button>
      <span className="text-label-2 text-white">{selectedCount}장의 사진이 선택됨</span>
      <button className="cursor-pointer" onClick={handleDelete}>
        <Image src="/svg/trash.svg" alt="trash" width={24} height={24} />
      </button>
    </div>
  );
};

export default SelectModeActionBar;
