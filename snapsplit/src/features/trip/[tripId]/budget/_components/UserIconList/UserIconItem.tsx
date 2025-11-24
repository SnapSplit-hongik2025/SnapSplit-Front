import { ICON_OFFSET } from '@/shared/constants/icon';
import Image from 'next/image';
export const UserIconItem = ({ index, userIconImg }: { index: number; userIconImg: string }) => {
  return (
    <div
      className="absolute rounded-full w-5 h-5 bg-grey-250 outline-3 outline-white"
      style={{ left: `${index * ICON_OFFSET}px` }}
    >
      <Image src={userIconImg} alt="user icon" fill className="rounded-full object-cover" />
    </div>
  );
};
