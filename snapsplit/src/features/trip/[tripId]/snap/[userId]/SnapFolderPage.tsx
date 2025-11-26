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
import { getPhotosByFolder, downloadImage } from '@/features/trip/[tripId]/snap/api/snap-api';
import { getDayCount } from '@/shared/utils/parseDate';
import { getTripBudgetData } from '@/features/trip/[tripId]/budget/api/budget-api';
import { useQuery } from '@tanstack/react-query';
import Loading from '@/shared/components/loading/Loading';

const SnapFolderPage = () => {
  const router = useRouter();
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    days: [],
    people: [],
    locations: [],
  });
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<'date_desc' | 'date_asc'>('date_desc');
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

  // trip 기본 정보
  const { data: tripData, isLoading: tripLoading } = useQuery({
    queryKey: ['tripBudget', tripId],
    queryFn: () => getTripBudgetData(Number(tripId)),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch photos for the current folder
  const fetchPhotos = useCallback(async (pageToLoad: number) => {
    if (isFetchingRef.current || !tripId || !userId) return;
    
    isFetchingRef.current = true;
    setLoading(true);

    try {
      const response = await getPhotosByFolder(Number(tripId), userId, pageToLoad, selectedSort);
      
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

  if (!tripData || tripLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  const handleDownloadSelected = async () => {
    if (selectedImageIds.length === 0 || !tripId) return;
    
    try {
      const blob = await downloadImage(Number(tripId), selectedImageIds.map(id => Number(id)));
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'selected_photos.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Download failed:', error);
      alert('다운로드에 실패했습니다.');
    }
  };

  const dayCount = getDayCount(tripData.startDate ?? '', tripData.endDate ?? '');

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
          onSortChange={(sort: 'date_desc' | 'date_asc') => {
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
              dayCount={dayCount}
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
        <SelectModeActionBar 
          selectedCount={selectedImageIds.length} 
          tripId={Number(tripId)} 
          photoIds={selectedImageIds.map((id) => Number(id))}
          onDownload={handleDownloadSelected}
          onDelete={() => {
            // 선택 모드 종료
            setIsSelectionMode(false);
            setSelectedImageIds([]);
            // 첫 페이지부터 다시 불러오기
            fetchPhotos(0);
          }}
        />
      )}
    </div>
  );
};

export default SnapFolderPage;
