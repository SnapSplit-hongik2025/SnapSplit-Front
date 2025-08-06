import FloatingModal from '@/shared/components/modal/FloatingModal';
import Image from 'next/image';

type StatusMessageProps = {
  result: string;
};

const StatusMessage = ({ result }: StatusMessageProps) => {
  const fullMessage = `공동 경비 잔액이 ${result} 로 늘어나요!`;
  const isOneLine = fullMessage.length <= 32; // 🔁 기준은 글자 수 또는 실제 측정값

  return (
    <FloatingModal>
      <div className="flex flex-col items-center w-full px-5 mb-34 mt-auto">
        <div className="bg-grey-850 rounded-xl px-4 py-2.5 text-body-1 text-grey-450 text-center max-w-[320px]">
          <div className={`${isOneLine ? 'flex' : 'flex flex-col'}`}>
            <div>공동 경비 잔액이</div>
            <div className="text-primary break-all">&nbsp;{result}&nbsp;</div>
            <div>로 늘어나요!</div>
          </div>
        </div>
        <Image src="/svg/bubble-tail.svg" alt="bubble-tail" width={18} height={15} className="-mt-1" />
      </div>
    </FloatingModal>
  );
};

export default StatusMessage;
