'use client';

import { useState } from 'react';
import SearchBar from '@/shared/components/SearchBar';
import BottomCTAButton from '@/shared/components/BottomCTAButton';
import UserList from './UserList';
import { AddMemberSectionProps } from './type';
import { useMutation } from '@tanstack/react-query';
import { getUserInfo } from '@trip/createTrip/api/create-trip-api';
import { UserInfoDto } from '@trip/createTrip/types/type';

const AddMemberSection = ({ onClick: handleNextStep }: AddMemberSectionProps) => {
  const [searchId, setSearchId] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<UserInfoDto[]>([]);
  const [searchedUser, setSearchedUser] = useState<UserInfoDto>();

  // 유저 검색 API 요청 뮤테이션
  const {
    mutate: searchUser,
    // isPending,
    // error,
  } = useMutation({
    mutationFn: (keyword: string) => getUserInfo(keyword),
    onSuccess: (searchedUser) => {
      setSearchedUser(searchedUser ?? undefined);
    },
  });

  // 유저 검색 핸들러
  const handleSearch = () => {
    console.log('검색어:', searchId);

    // 공백 제거 후 빈 문자열이면 경고창
    const keyword = searchId.trim();
    if (!keyword) {
      alert('검색어를 입력해주세요.');
      return;
    }

    // 검색 API 호출
    searchUser(keyword);
  };

  // 유저 선택 토글
  const toggleSelectUser = (userToToggle: UserInfoDto) => {
    setSelectedUsers((prevSelectedUsers) => {
      const isAlreadySelected = prevSelectedUsers.some((selectedUser) => selectedUser.id === userToToggle.id);

      if (isAlreadySelected) {
        // 이미 선택되었다면, 해당 유저를 배열에서 제거
        return prevSelectedUsers.filter((selectedUser) => selectedUser.id !== userToToggle.id);
      } else {
        // 선택되지 않았다면, 새로운 유저를 배열에 추가
        return [...prevSelectedUsers, userToToggle];
      }
    });
  };

  return (
    <div className="flex flex-col justify-between px-5" style={{ height: 'calc(100vh - 95px - 16px)' }}>
      <div className="flex flex-col">
        <div className="pb-6">
          <p className="text-head-1">
            함께 여행하는
            <br />
            동행이 있다면 추가해주세요
          </p>
          <p className="text-body-2 text-grey-850">동행은 나중에 다시 추가할 수 있어요</p>
        </div>
        <div className="flex gap-2 relative">
          <SearchBar
            placeholder="코드 또는 이름을 입력해주세요"
            value={searchId}
            onChange={(e) => {
              setSearchId(e.target.value);
            }}
          />
          <button
            onClick={handleSearch}
            className="absolute right-0 px-4 py-3 rounded-xl text-grey-550 text-body-2 font-medium whitespace-nowrap cursor-pointer"
          >
            확인
          </button>
        </div>
        {/* {searchError && <p className="text-caption-1 text-red-500 pt-2">{searchError}</p>} */}
        <UserList searchedUser={searchedUser} selectedUsers={selectedUsers} onToggle={toggleSelectUser} />
      </div>
      <BottomCTAButton label="다음으로" onClick={handleNextStep} />
    </div>
  );
};

export default AddMemberSection;
