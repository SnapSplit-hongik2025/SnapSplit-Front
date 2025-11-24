import Image from 'next/image';
import close from '@public/svg/close-grey-550.svg';
import Button from '@/shared/components/Button';

export type ConfirmSplitModalProps = {
  onClose?: () => void;
  onConfirm?: () => void;
};

export default function ConfirmSplitModal({ onClose, onConfirm }: ConfirmSplitModalProps) {
  return (
    <div className="bg-white flex flex-col p-5 rounded-xl w-full items-center justify-center">
      <button className="flex w-full justify-end cursor-pointer pb-2" onClick={onClose}>
        <Image src={close} alt="close" />
      </button>
      <p className="text-title-1">해당 기간의 지출 등록이</p>
      <p className="text-title-1 pb-2">모두 끝났나요?</p>
      <label className="text-body-2 text-grey-550">정산 영수증을 뽑고나면 해당 기간의 지출은</label>
      <label className="text-body-2 text-grey-550 pb-6">더 이상 정산할 수 없습니다</label>
      <div className="flex w-full gap-3">
        <Button label="아니요" bg="bg-grey-650" onClick={onClose} />
        <Button label="네" onClick={onConfirm} />
      </div>
    </div>
  );
}
