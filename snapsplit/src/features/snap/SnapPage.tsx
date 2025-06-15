'use client';
import { useState, useRef } from 'react';
import TabSelector from './_components/TabSelector';
import UploadButton from './_components/UploadButton';
import SortBottomSheet from './_components/SortBottomSheet';
import FilterBottomSheet from './_components/FilterBottomSheet';
import BottomNavBar from '@/shared/components/BottomNavBar';
import TripHeader from '@/features/trip/[tripId]/_components/TripHeader';
import TripInfo from '@/features/trip/[tripId]/_components/TripInfo';
import { FilterState } from '@/features/snap/type';
import { UploadedImage } from '@/features/snap/type';
import BaseTabView from './_components/tabView/BaseTabView';
import FolderTabView from './_components/tabView/FolderTabView';
import { ActiveTab } from '@/features/snap/type';

export default function GalleryPage() {
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('최신순');
  const [filters, setFilters] = useState<FilterState>({
    days: [],
    people: [],
    locations: [],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 테스트 데이터
  const countries = [
    { countryId: 1, countryName: '런던' },
    { countryId: 2, countryName: '파리' },
    { countryId: 3, countryName: '취리히' },
  ];

  const testImages: UploadedImage[] = [
    {
      id: '1-jisu-london',
      src: '/svg/1-jisu-london.png',
      tags: {
        days: [1],
        people: ['지수'],
        locations: ['런던']
      }
    },
    {
      id: '2-jisu-na-yeon-paris',
      src: '/svg/2-jisu-na-yeon-paris.png',
      tags: {
        days: [2],
        people: ['지수', '나경', '연수'],
        locations: ['파리']
      }
    }
  ];

  const filteredImages = testImages.filter((img) => {
    const matchDay = filters.days.length === 0 || filters.days.some((d) => img.tags.days.includes(d));
    const matchPeople = filters.people.length === 0 || filters.people.some((p) => img.tags.people.includes(p));
    const matchLocation = filters.locations.length === 0 || filters.locations.some((l) => img.tags.locations.includes(l));
    return matchDay && matchPeople && matchLocation;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('전체');

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="bg-grey-350">
        <TripHeader />
        <TripInfo
          tripName={'유luv여행'}
          countries={countries}
          memberCount={4}
          startDate={'2025.4.7'}
          endDate={'4.12'}
        />
      </div>
      <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 컨텐츠 영역 */}
      {activeTab === '전체' ? (
        <BaseTabView 
          images={filteredImages}
          selectedSort={selectedSort}
          onSortOpen={() => setSortOpen(true)}
          onFilterOpen={() => setFilterOpen(true)}
          filters={filters}
        />
      ) : (
        <FolderTabView />
      )}
      <UploadButton inputRef={fileInputRef} />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) alert(`파일 선택됨: ${file.name}`);
        }}
      />
      {sortOpen && (
        <div className="fixed inset-0 z-100">
          {/* 어두운 배경 */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setSortOpen(false)}
          />
          {/* 정렬 bottom sheet */}
          <SortBottomSheet
            selectedSort={selectedSort}
            onSelectSort={(opt) => setSelectedSort(opt)}
            onClose={() => setSortOpen(false)}
          />
        </div>
      )}
      {filterOpen && (
        <div className="fixed inset-0 z-100">
          {/* 어두운 배경 */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setFilterOpen(false)}
          />
          {/* 필터 bottom sheet */}
          <FilterBottomSheet
            filters={filters}
            setFilters={setFilters}
            onClose={() => setFilterOpen(false)}
          />
        </div>
      )}
      {/* 컨텐츠 영역 */}
      

      {/* 하단 네비게이션 */}
      <BottomNavBar />
    </div>
  );
}
