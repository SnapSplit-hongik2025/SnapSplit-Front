'use client';

import PhotoGrid from '@/features/trip/[tripId]/snap/_components/PhotoGrid';
import SnapFolderHeader from '@/features/trip/[tripId]/snap/[userId]/_components/SnapFolderHeader';
import SnapFolderInfo from '@/features/trip/[tripId]/snap/[userId]/_components/SnapFolderInfo';
import { useState } from 'react';
import { FilterState } from '@/features/trip/[tripId]/snap/type';
import FilterBottomSheet from '@/features/trip/[tripId]/snap/_components/fiterBottomSheet/FilterBottomSheet';
import { useRouter } from 'next/navigation';
import SortFilterBar from '@/features/trip/[tripId]/snap/_components/sortFilterBar/SortFilterBar';
import SortBottomSheet from '@/features/trip/[tripId]/snap/_components/SortBottomSheet';
import BottomSheet from '@/shared/components/bottom-sheet/BottomSheet';
import { mockPhotos } from '@/shared/mock/Photos';
import SelectModeActionBar from './_components/SelectModeActionBar';

// TODO: 사진 데이터 props로 전달
const testImages = mockPhotos;

const SnapFolderPage = () => {
  const router = useRouter();
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    days: [],
    people: [],
    locations: [],
  });
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('최신순');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);

  const handleToggleSelect = (idx: string) => {
    if (selectedImageIds.includes(idx)) {
      setSelectedImageIds(selectedImageIds.filter((id) => id !== idx));
    } else {
      setSelectedImageIds([...selectedImageIds, idx]);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-light_grey">
      <div className="flex flex-col bg-white">
        <SnapFolderHeader
          onClose={() => {
            router.back();
          }}
          isSelectionMode={isSelectionMode}
          setIsSelectionMode={setIsSelectionMode}
          setSelectedImageIds={setSelectedImageIds}
        />
        <SnapFolderInfo />
      </div>

      {/* GallerySection */}
      <div className="flex flex-col overflow-y-auto scrollbar-hide h-full px-5">
        <SortFilterBar
          selectedSort={selectedSort}
          onSortOpen={() => {
            setSortOpen(true);
          }}
          onFilterOpen={() => setFilterOpen(true)}
          filters={filters}
          setFilters={setFilters}
        />

        <div
          className={
            filters.days.length > 0 || filters.people.length > 0 || filters.locations.length > 0
              ? 'min-h-27'
              : 'min-h-16'
          }
        />

        <PhotoGrid
          images={testImages}
          isSelectionMode={isSelectionMode}
          selectedImageIds={selectedImageIds}
          onToggleSelect={handleToggleSelect}
        />

        {filterOpen && (
          <BottomSheet isOpen={filterOpen} onClose={() => setFilterOpen(false)}>
            <FilterBottomSheet
              filters={filters}
              setFilters={setFilters}
              onClose={() => setFilterOpen(false)}
              tab="folder"
            />
          </BottomSheet>
        )}

        {sortOpen && (
          <BottomSheet isOpen={sortOpen} onClose={() => setSortOpen(false)}>
            <SortBottomSheet
              selectedSort={selectedSort}
              onSelectSort={(opt) => setSelectedSort(opt)}
              onClose={() => setSortOpen(false)}
            />
          </BottomSheet>
        )}
      </div>
      {isSelectionMode && (
        <SelectModeActionBar selectedCount={selectedImageIds.length} />
      )}
    </div>
  );
};

export default SnapFolderPage;
