import Link from 'next/link';
import Image from 'next/image';
import { CreateTripHeaderProps } from '@/features/trip/createTrip/type';

const CreateTripHeader = ({ step, onPrev }: CreateTripHeaderProps) => {
  return (
    <header className="px-5 py-3">
      {step <= 1 ? (
        <Link href="/home">
          <Image src="/svg/arrow-left-grey-850.svg" alt="back" aria-label="홈으로" width={24} height={24} />
        </Link>
      ) : (
        <button onClick={onPrev} aria-label="이전 단계로 이동">
          <Image src="/svg/arrow-left-grey-850.svg" alt="back" width={24} height={24} />
        </button>
      )}
    </header>
  );
};

export default CreateTripHeader;
