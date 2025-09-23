import { UserInfoDto } from '@trip/createTrip/types/type';

export type AddMemberSectionProps = {
  onClick: () => void;
  selectedUsers: UserInfoDto[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<UserInfoDto[]>>;
 };

export type UserListProps = {
  searchedUser?: UserInfoDto;
  selectedUsers: UserInfoDto[];
  onToggle: (user: UserInfoDto) => void; // 인자 이름을 명확하게 변경
};
