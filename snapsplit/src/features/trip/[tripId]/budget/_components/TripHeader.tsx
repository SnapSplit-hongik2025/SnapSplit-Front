import Link from 'next/link';
import Image from 'next/image';
import exit from '@public/svg/exit.svg';
import burger from '@public/svg/burger.svg';

const TripHeader = () => {
  return (
    <header className="px-5 py-3 flex justify-between">
      <Link href="/home">
        <Image src={exit} alt="exit" aria-label="홈으로" />
      </Link>

      {/* 메뉴 열리는 걸로 나중에 수정 */}
      <Link href="/">
        <Image src={burger} alt="burger" aria-label="menu" />
      </Link>
    </header>
  );
};

export default TripHeader;
