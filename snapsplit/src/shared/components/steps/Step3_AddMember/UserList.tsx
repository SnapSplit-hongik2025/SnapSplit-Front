import { UserInfoDto } from '@/features/trip/createTrip/types/type';
import SelectButton from '@/shared/components/SelectButton';
import { UserListProps } from './type';
import Image from 'next/image';

const UserItem = ({
  user,
  isSelected,
  onToggle,
}: {
  user: UserInfoDto;
  isSelected: boolean;
  onToggle: (user: UserInfoDto) => void;
}) => {
  return (
    <div className="w-full flex items-center gap-3 bg-white rounded-xl">
      <div className="w-[11px] h-[11px] bg-grey-250 rounded-full" />
      {/* <Image
        src={user.profileImage}
        alt={user.name}
        width={11}
        height={11}
        className="w-11 h-11 rounded-full object-cover"
      /> */}
      <div className="flex-1 text-body-1 text-black">{user.name}</div>
      <SelectButton isSelected={isSelected} onClick={() => onToggle(user)} label={isSelected ? '취소' : '추가'} />
    </div>
  );
};

const UserList = ({ searchedUser, selectedUsers, onToggle }: UserListProps) => {
  return (
    <div className="flex flex-col gap-3 pt-6">
      {selectedUsers &&
        selectedUsers.length > 0 &&
        selectedUsers.map((user) => <UserItem key={user.id} user={user} isSelected={true} onToggle={onToggle} />)}
      {searchedUser &&
        // 검색된 사용자가 이미 선택된 사용자 목록에 있는지 확인
        !selectedUsers.some((user) => user.id === searchedUser.id) && (
          <UserItem key={searchedUser.id} user={searchedUser} isSelected={false} onToggle={onToggle} />
        )}
    </div>
  );
};

export default UserList;
