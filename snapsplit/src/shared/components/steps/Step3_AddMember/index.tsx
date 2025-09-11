'use client';

import { useState } from 'react';
import SearchBar from '@/shared/components/SearchBar';
import BottomCTAButton from '@/shared/components/BottomCTAButton';
import UserList from './UserList';
import { AddMemberSectionProps, UserItemProps } from './type';
import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from '@/features/trip/createTrip/api/create-trip-api';

const AddMemberSection = ({ onClick: handleNextStep }: AddMemberSectionProps) => {
  const [searchId, setSearchId] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<UserItemProps[]>([]);
  const [searchError, setSearchError] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const handleSearch = async () => {
    const keyword = searchId.trim();
    if (!keyword) {
      setSearchError('검색어를 입력해주세요.');
      setFilteredUsers([]);
      return;
    }

    setSearchError('');
    setIsLoading(true);

    try {
      // ▶︎ API 호출: 유저코드 기준 조회
      const user = await getUserInfo(keyword);

      // 성공 시 1명만 반환된다고 가정 → 리스트에 1개로 넣어줌
      const found: UserItemProps[] = user ? [mapToUserItem(user)] : [];

      if (found.length === 0) {
        setSearchError('검색 결과가 없습니다.');
      }
      setFilteredUsers(found);
    } catch (e: any) {
      // API 에러 메시지 노출
      setFilteredUsers([]);
      setSearchError(e?.message || '검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelectUser = (userId: string) => {
    setSelectedUserIds((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
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
              setSearchError('');
            }}
          />
          <button
            onClick={handleSearch}
            className="absolute right-0 px-4 py-3 rounded-xl text-grey-550 text-body-2 font-medium whitespace-nowrap cursor-pointer"
          >
            확인
          </button>
        </div>
        {searchError && <p className="text-caption-1 text-red-500 pt-2">{searchError}</p>}
        <UserList users={filteredUsers} selectedUserIds={selectedUserIds} onToggle={toggleSelectUser} />
      </div>
      <BottomCTAButton label="다음으로" onClick={handleNextStep} />
    </div>
  );
};

export default AddMemberSection;
function setIsLoading(arg0: boolean) {
  throw new Error('Function not implemented.');
}
