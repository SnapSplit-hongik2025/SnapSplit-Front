'use client';

import { CountryComponentProps, CountryListProps } from './type';
import { useDragScroll } from '@/shared/utils/useDragScroll';
import SelectButton from '@/shared/components/SelectButton';

const CountryComponent = ({ countryName, isSelected, onClick }: CountryComponentProps) => {
  return (
    <div className="flex justify-between items-center">
      <p className="text-body-2">{countryName}</p>
      <SelectButton isSelected={isSelected} onClick={onClick} label="선택" />
    </div>
  );
};

const CountryList = ({ variant, countries, selected, onToggle }: CountryListProps) => {
  const { scrollRef, onMouseDown, onMouseMove, onMouseUp } = useDragScroll('y');
  const offset = variant === 'edit' ? 288 : 348;

  return (
    <div
      ref={scrollRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      className="space-y-5 overflow-y-auto pb-5 scrollbar-hide scrollbar-hide::-webkit-scrollbar"
      style={{ height: `calc(100vh - ${offset}px - 16px)` }}
    >
      {countries.map((country) => (
        <CountryComponent
          key={country.countryId}
          countryName={country.countryName}
          isSelected={selected.some((c) => c.countryId === country.countryId)}
          onClick={() => onToggle(country)}
        />
      ))}
    </div>
  );
};

export default CountryList;
