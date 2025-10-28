import Link from 'next/link';
import Image from 'next/image';
import arrow from '@public/svg/arrow-left-grey-850.svg';

export default function FaceHeader() {
  return (
    <header className="py-3 flex items-center justify-between">
      <Link href="/my">
        <Image src={arrow} alt="exit" aria-label="홈으로" />
      </Link>
      <h1 className="text-label-1">나의 얼굴</h1>
      <div className="w-[25px]"></div>
    </header>
  );
}
