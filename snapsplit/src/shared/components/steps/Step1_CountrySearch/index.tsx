'use client';

import { useState } from 'react';
import CountryList from './CountryList';
import SearchBar from '@/shared/components/SearchBar';
import SelectedCountryList from './SelectedCountryList';
import BottomCTAButton from '@/shared/components/BottomCTAButton';
import { CountrySearchSectionProps } from './type';

const CountrySearchSection = ({
  countries,
  selected,
  onToggle,
  onClick: handleNextStep,
  variant = 'create',
}: CountrySearchSectionProps) => {
  // 검색 관리
  const [searchKeyword, setSearchKeyword] = useState('');
  const filteredCountries = Array.isArray(countries)
    ? countries.filter(({ countryName }) => countryName.toLowerCase().includes(searchKeyword.toLowerCase()))
    : [];

  const isEdit = variant === 'edit';

  return (
    <div className={`flex flex-col justify-between px-5 pb-3 ${isEdit ? 'h-full' : ''}`}>
      <div className="pb-6">
        <p className="text-head-1">{isEdit ? '여행지를 변경하시나요?' : '어디로 떠나시나요?'}</p>
        <p className="text-body-2 text-grey-850">
          {isEdit ? '원하시는 여행지를 선택해주세요' : '여행지가 여러 곳이라면 모두 입력해주세요'}
        </p>
      </div>
      <SearchBar
        placeholder="여행지를 검색해보세요"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />
      <SelectedCountryList selected={selected} onRemove={onToggle} />
      <CountryList variant={variant} countries={filteredCountries} selected={selected} onToggle={onToggle} />
      {selected.length > 0 && (
        <BottomCTAButton
          label={
            selected.length >= 2
              ? `${selected[0].countryName} 외 ${selected.length - 1}개 선택 완료`
              : `${selected[0].countryName} 선택 완료`
          }
          onClick={handleNextStep}
        />
      )}
    </div>
  );
};

export default CountrySearchSection;
