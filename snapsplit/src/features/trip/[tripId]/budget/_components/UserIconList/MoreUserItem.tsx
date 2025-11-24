import { ICON_OFFSET } from '@/shared/constants/icon';

export const MoreUsersItem = ({ index, count }: { index: number; count: number }) => {
  return (
    <div
      className="absolute rounded-full w-5 h-5 bg-grey-250 flex items-center justify-center text-[10px] text-white outline-3 outline-white"
      style={{ left: `${index * ICON_OFFSET}px` }}
    >
      +{count}
    </div>
  );
};
