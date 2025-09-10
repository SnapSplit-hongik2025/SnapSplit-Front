'use client';

import Button from "@/shared/components/Button";
import Image from "next/image";
import close from "@public/svg/close-grey-550.svg";
type PhotoDeleteModalContentProps = {
  onClose: () => void;
  onClickDelete: () => void;
};

function PhotoDeleteModalContent({ onClose, onClickDelete }: PhotoDeleteModalContentProps) {
  return (
    <div className="w-full h-full bg-black/40 flex items-center justify-center">
      <div className="flex flex-col w-full bg-white m-5 p-5 rounded-xl items-center">
        <div className="flex items-end justify-end pb-2 w-full">
          <button onClick={onClose} className="cursor-pointer">
            <Image src={close} alt="close" />
          </button>
        </div>
        <span className="text-title-1 pb-6">정말 사진을 삭제하시겠습니까?</span>
        <div className="flex gap-3 w-full">
          <Button label="아니요" bg="bg-grey-650" onClick={onClose} />
          <Button label="네" bg="bg-primary" onClick={onClickDelete} />
        </div>
      </div>
    </div>
  );
}

export default PhotoDeleteModalContent;
