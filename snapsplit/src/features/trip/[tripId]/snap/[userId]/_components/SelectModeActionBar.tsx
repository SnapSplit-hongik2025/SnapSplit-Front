import Image from 'next/image';
import { deleteImages } from '@/features/trip/[tripId]/snap/api/snap-api';
type SelectModeActionBarProps = {
  selectedCount: number;
  tripId: number;
  photoIds: number[];
  onDelete?: () => void;
};

const SelectModeActionBar = ({ selectedCount, tripId, photoIds, onDelete }: SelectModeActionBarProps) => {
  const handleDelete = async () => {
    await deleteImages(tripId, photoIds);
    onDelete?.();
  };
  return (
    <div className="flex-shrink-0 flex items-center justify-between h-14 px-5 py-4 bg-grey-850">
      <Image src="/svg/upload.svg" alt="upload" width={24} height={24} />
      <span className="text-label-2 text-white">{selectedCount}장의 사진이 선택됨</span>
      <button className="cursor-pointer" onClick={handleDelete}><Image src="/svg/trash.svg" alt="trash" width={24} height={24} /></button>
    </div>
  );
};

export default SelectModeActionBar;