import { UserIconListProps } from '../../types/budget-type';
import { UserIconItem } from './UserIconItem';
import { MoreUsersItem } from './MoreUserItem';
import { MAX_VISIBLE_ICONS } from '@/shared/constants/icon';

const UserIconList = ({ memberProfileImages }: UserIconListProps) => {
  const hasExtra = memberProfileImages.length > MAX_VISIBLE_ICONS;
  const visibleUsers = hasExtra ? memberProfileImages.slice(0, MAX_VISIBLE_ICONS - 1) : memberProfileImages;
  const extraCount = memberProfileImages.length - (MAX_VISIBLE_ICONS - 1);

  const displayCount = hasExtra ? MAX_VISIBLE_ICONS : memberProfileImages.length;

  return (
    <div className="relative" style={{ width: `${18 * displayCount + 5}px`, height: '20px' }}>
      {visibleUsers.map((user, index) => (
        <UserIconItem key={user} index={index} userIconImg={user} />
      ))}
      {hasExtra && <MoreUsersItem index={MAX_VISIBLE_ICONS - 1} count={extraCount} />}
    </div>
  );
};

export default UserIconList;
