'use client';

import { useState, useRef, useEffect } from 'react';
import SortFilterBar from '@/features/trip/[tripId]/snap/_components/sortFilterBar/SortFilterBar';
import PhotoGrid from '@/features/trip/[tripId]/snap/_components/PhotoGrid';
import SortBottomSheet from '@/features/trip/[tripId]/snap/_components/SortBottomSheet';
import FilterBottomSheet from '@/features/trip/[tripId]/snap/_components/fiterBottomSheet/FilterBottomSheet';
import BottomSheet from '@/shared/components/bottom-sheet/BottomSheet';
import { FilterState } from '@/features/trip/[tripId]/snap/type';
import { PhotoResponse } from '@/features/trip/[tripId]/snap/types/snap-dto-types';

type BaseTabViewProps = {
  setIsScrolled: (show: boolean) => void;
  setScrollToTop: (fn: () => void) => void;
  photos?: PhotoResponse[]; // null 제거!
  onLoadMore?: () => void; // 무한 스크롤 트리거
  isLoading?: boolean; // 로딩 중인지
  selectedSort?: string;
  setSelectedSort?: (sort: string) => void;
  onRefresh?: () => void;
};

export default function BaseTabView({
  setIsScrolled,
  setScrollToTop,
  photos,
  onLoadMore,
  isLoading,
  selectedSort,
  setSelectedSort,
  onRefresh,
}: BaseTabViewProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    days: [],
    people: [],
    locations: [],
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // -------------------------------
  // 1. 필터 반영된 이미지 목록
  // -------------------------------
  const filteredImages = photos?.filter((img) => {
    const dateStr = img.photoDate ?? ''; // null-safe

    const matchDay = filters.days.length === 0 || filters.days.some((d) => dateStr.includes(String(d)));

    const matchPeople =
      filters.people.length === 0 ||
      filters.people.some((person) => img.taggedUsers.some((u) => u.name.includes(person)));

    return matchDay && matchPeople;
  });

  // -------------------------------
  // 2. scrollToTop 외부 전달
  // -------------------------------
  useEffect(() => {
    const scrollToTop = () => {
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };
    setScrollToTop(() => scrollToTop);
  }, [setScrollToTop]);

  // -------------------------------
  // 3. 상단 헤더 스크롤 감지
  // -------------------------------
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      setIsScrolled(el.scrollTop > 100);
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [setIsScrolled]);

  // -------------------------------
  // 4. 무한 스크롤 IntersectionObserver
  // -------------------------------
  useEffect(() => {
    if (!bottomRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (!isLoading) {
            onLoadMore?.();
          }
        }
      },
      {
        root: scrollRef.current, // <-- 이 부분이 핵심
        threshold: 0.1,
      }
    );

    observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, [isLoading, onLoadMore]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 flex flex-col px-5 pb-5 h-full overflow-y-auto scrollbar-hide bg-light_grey"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <SortFilterBar
        selectedSort={selectedSort ?? ''}
        onSortOpen={() => setSortOpen(true)}
        onFilterOpen={() => setFilterOpen(true)}
        filters={filters}
        setFilters={setFilters}
      />

      {/* 필터 적용 여부에 따라 여백 변경 */}
      <div className={filters.days.length > 0 || filters.people.length > 0 ? 'min-h-27' : 'min-h-16'} />

      {/* 사진 그리드 */}
      <PhotoGrid 
        images={filteredImages ?? []} 
        onRefresh={onRefresh} 
        isSelectionMode={false}
        selectedImageIds={[]}
        onToggleSelect={() => {}}
      />

      {/* 로딩 스피너 */}
      {isLoading && <div className="w-full py-4 flex justify-center text-neutral-400 text-sm">로딩 중...</div>}

      {/* 무한 스크롤 감지용 div */}
      <div ref={bottomRef} style={{ height: 1 }} />

      {/* 정렬 BottomSheet */}
      <BottomSheet isOpen={sortOpen} onClose={() => setSortOpen(false)}>
        <SortBottomSheet
          selectedSort={selectedSort ?? ''}
          onSelectSort={(opt) => setSelectedSort?.(opt)}
          onClose={() => setSortOpen(false)}
        />
      </BottomSheet>

      {/* 필터 BottomSheet */}
      <BottomSheet isOpen={filterOpen} onClose={() => setFilterOpen(false)}>
        <FilterBottomSheet filters={filters} setFilters={setFilters} onClose={() => setFilterOpen(false)} tab="base" />
      </BottomSheet>
    </div>
  );
}
