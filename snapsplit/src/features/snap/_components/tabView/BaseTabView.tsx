'use client';

interface BaseTabViewProps {
  images: UploadedImage[];
  selectedSort: string;
  onSortOpen: () => void;
  onFilterOpen: () => void;
  filters: {
    days: number[];
    people: string[];
    locations: string[];
  };
}

import SortFilterBar from '../SortFilterBar';
import PhotoGrid from '../PhotoGrid';
import { UploadedImage } from '../../type';

export default function BaseTabView({ 
  images, 
  selectedSort,
  onSortOpen,
  onFilterOpen,
  filters 
}: BaseTabViewProps) {
  return (
    <div className="pt-4">
      <SortFilterBar
        selectedSort={selectedSort}
        onSortOpen={onSortOpen}
        onFilterOpen={onFilterOpen}
      />
      <div className="flex flex-wrap gap-2 px-4 py-3">
        {filters.days.map((day: number) => (
          <span key={day} className="bg-grey-350 px-3 py-1 rounded-full text-xs text-white">
            Day {day}
          </span>
        ))}
        {filters.people.map((name: string) => (
          <span key={name} className="bg-grey-350 px-3 py-1 rounded-full text-xs text-white">
            {name}
          </span>
        ))}
        {filters.locations.map((loc: string) => (
          <span key={loc} className="bg-grey-350 px-3 py-1 rounded-full text-xs text-white">
            {loc}
          </span>
        ))}
      </div>
      <PhotoGrid images={images} />
    </div>
  );
}
