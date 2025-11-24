import Image from 'next/image';
import Link from 'next/link';

export default function ActionBar() {
  return (
    <div className="flex items-center w-full px-5 py-3">
      <Link href={'/home'} className="cursor-pointer ml-auto">
        <Image src="/svg/exit-grey-1000.svg" alt="exit" aria-label="홈으로" width={24} height={24} />
      </Link>
    </div>
  );
}
