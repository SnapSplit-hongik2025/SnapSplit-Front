'use client';

import PhotoGrid from '@/features/trip/[tripId]/snap/_components/PhotoGrid';
import SnapFolderHeader from '@/features/trip/[tripId]/snap/[userId]/_components/SnapFolderHeader';
import SnapFolderInfo from '@/features/trip/[tripId]/snap/[userId]/_components/SnapFolderInfo';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { FilterState } from '@/features/trip/[tripId]/snap/type';
import FilterBottomSheet from '@/features/trip/[tripId]/snap/_components/fiterBottomSheet/FilterBottomSheet';
import SortFilterBar from '@/features/trip/[tripId]/snap/_components/sortFilterBar/SortFilterBar';
import SortBottomSheet from '@/features/trip/[tripId]/snap/_components/SortBottomSheet';
import BottomSheet from '@/shared/components/bottom-sheet/BottomSheet';
import SelectModeActionBar from './_components/SelectModeActionBar';
import { PhotoResponse } from '@/features/trip/[tripId]/snap/types/snap-dto-types';
import { getPhotosByFolder } from '@/features/trip/[tripId]/snap/api/snap-api';

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
  const [images, setImages] = useState<PhotoResponse[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const isFetchingRef = useRef(false);
  const params = useParams();
  const tripId = params.tripId as string;
  const userId = params.userId as string;
  const searchParams = useSearchParams();
  
  // URL에서 폴더 정보 가져오기
  const folderName = searchParams.get('name') || '사용자';
  const profileImageUrl = searchParams.get('profileImageUrl') || undefined;

  console.log("[tripId, userId, folderName]:", tripId, userId, folderName);

  // Fetch photos for the current folder
  const fetchPhotos = useCallback(async (pageToLoad: number) => {
    if (isFetchingRef.current || !tripId || !userId) return;
    
    isFetchingRef.current = true;
    setLoading(true);

    try {
      const sortParam = selectedSort === '최신순' ? 'date_desc' : 'date_asc';
      const response = await getPhotosByFolder(Number(tripId), userId, pageToLoad, sortParam);
      
      setImages(prev => pageToLoad === 0 ? response.photos : [...prev, ...response.photos]);
      setPage(pageToLoad);
      setHasNext(!response.last);
    } catch (error) {
      console.error('Failed to fetch photos:', error);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [tripId, userId, selectedSort]);

  // Initial load and when sort changes
  useEffect(() => {
    fetchPhotos(0);
  }, [fetchPhotos]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (loading || !hasNext) return;
    
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
    
    if (isNearBottom) {
      fetchPhotos(page + 1);
    }
  }, [fetchPhotos, hasNext, loading, page]);

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);


  const handleToggleSelect = (idx: string) => {
    if (selectedImageIds.includes(idx)) {
      setSelectedImageIds(selectedImageIds.filter((id) => id !== idx));
    } else {
      setSelectedImageIds([...selectedImageIds, idx]);
    }
  };

  // Refresh function to be called after actions like delete
  const handleRefresh = useCallback(() => {
    setImages([]);
    setPage(0);
    setHasNext(true);
    fetchPhotos(0);
  }, [fetchPhotos]);

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
        <SnapFolderInfo name={folderName} profileImageUrl={profileImageUrl || undefined} />
      </div>

      {/* GallerySection */}
      <div className="flex flex-col overflow-y-auto scrollbar-hide h-full px-5">
        <SortFilterBar
          selectedSort={selectedSort}
          onSortOpen={() => setSortOpen(true)}
          onFilterOpen={() => setFilterOpen(true)}
          filters={filters}
          setFilters={setFilters}
          onSortChange={(sort: string) => {
            setSelectedSort(sort);
            setImages([]);
            setPage(0);
            setHasNext(true);
            fetchPhotos(0);
          }}
        />

        <div
          className={
            filters.days.length > 0 || filters.people.length > 0 || filters.locations.length > 0
              ? 'min-h-27'
              : 'min-h-16'
          }
        />

        <PhotoGrid
          images={images}
          isSelectionMode={isSelectionMode}
          selectedImageIds={selectedImageIds}
          onToggleSelect={handleToggleSelect}
          onRefresh={handleRefresh}
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
