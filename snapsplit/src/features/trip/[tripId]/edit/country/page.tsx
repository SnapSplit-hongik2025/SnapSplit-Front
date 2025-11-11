'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import CountrySearchSection from '@/shared/components/steps/Step1_CountrySearch';
import { EditCountryPageProps } from './type';
import { Country } from '@/shared/types/country';
import { useQuery } from '@tanstack/react-query';
import { GetCountryTripDto } from '@/features/trip/createTrip/types/type';
import { editTripCountries, getTripCountries } from '../api/edit-trip-api';
import Loading from '@/shared/components/loading/Loading';

const EditCountryPage = ({ tripId }: EditCountryPageProps) => {
  const router = useRouter();

  const [selected, setSelected] = useState<Country[]>([]);

  const { data, isLoading, isError, error, isSuccess } = useQuery<GetCountryTripDto, Error>({
    queryKey: ['countryTrip', tripId],
    queryFn: () => getTripCountries(tripId),
    enabled: !!tripId,
  });

  useEffect(() => {
    if (data && data.selectedCountries) {
      setSelected(data.selectedCountries);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return <div>오류가 발생했습니다: {error.message}</div>;
  }

  if (!data || !isSuccess) {
    return <div>여행지 정보가 없습니다.</div>;
  }

  // mock 데이터
  const countries: Country[] = data.countries;

  // 토글 핸들러
  const toggleCountry = (country: Country) => {
    setSelected((prev) =>
      prev.some((c) => c.countryId === country.countryId)
        ? prev.filter((c) => c.countryId !== country.countryId)
        : [...prev, country]
    );
  };

  // "완료" 버튼 클릭 시, 예: API 호출 후 뒤로 가기
  const handleSave = async () => {
    await editTripCountries(tripId, selected);
    router.back();
  };

  return (
    <CountrySearchSection
      variant="edit"
      countries={countries}
      selected={selected}
      onToggle={toggleCountry}
      onClick={handleSave}
    />
  );
};

export default EditCountryPage;
