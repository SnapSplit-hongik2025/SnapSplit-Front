
import Image from 'next/image';
type SnapFolderHeaderProps = {
    onClose: () => void;
    isSelectionMode?: boolean;
    setIsSelectionMode?: (value: boolean) => void;
    setSelectedImageIds?: (ids: string[]) => void;
}

function SnapFolderHeader({ onClose, setIsSelectionMode, isSelectionMode, setSelectedImageIds }: SnapFolderHeaderProps) {
  return (
    <div className="flex justify-between items-center w-full h-12 px-5 py-3">
      <Image 
        src="/svg/arrow-left-grey-850.svg"
        alt="뒤로가기"
        width={24}
        height={24}
        onClick={onClose}
      />
      <div onClick={() => {setIsSelectionMode?.(!isSelectionMode); setSelectedImageIds?.([])}} className="text-body-3 text-grey-1000">
        {isSelectionMode ? '취소' : '사진 선택'}
      </div>
    </div>
  );
}

export default SnapFolderHeader;