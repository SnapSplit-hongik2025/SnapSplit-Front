import Link from 'next/link';
import Image from 'next/image';
import big_left_arrow from '@public/svg/big-left-arrow.svg';
import { routerPath } from '@/shared/constants/routePath';

const PastTripHeader = () => {
  return (
    <header className="flex py-3">
      <Link href={routerPath.home.href} aria-label="홈으로 돌아가기">
        <Image src={big_left_arrow} alt="뒤로가기" priority />
      </Link>
    </header>
  );
};

export default PastTripHeader;
