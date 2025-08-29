import { UserIconListProps } from '../../types/budget-type';
import { UserIconItem } from './UserIconItem';
import { MoreUsersItem } from './MoreUserItem';
import { MAX_VISIBLE_ICONS } from '@/shared/constants/icon';

const UserIconList = ({ users }: UserIconListProps) => {
  const hasExtra = users.length > MAX_VISIBLE_ICONS;
  const visibleUsers = hasExtra ? users.slice(0, MAX_VISIBLE_ICONS - 1) : users;
  const extraCount = users.length - (MAX_VISIBLE_ICONS - 1);

  const displayCount = hasExtra ? MAX_VISIBLE_ICONS : users.length;

  return (
    <div className="relative" style={{ width: `${18 * displayCount + 5}px`, height: '20px' }}>
      {visibleUsers.map((user, index) => (
        <UserIconItem key={user.userId} index={index} userIconImg={user.userIconImg} />
      ))}
      {hasExtra && <MoreUsersItem index={MAX_VISIBLE_ICONS - 1} count={extraCount} />}
    </div>
  );
};

export default UserIconList;
