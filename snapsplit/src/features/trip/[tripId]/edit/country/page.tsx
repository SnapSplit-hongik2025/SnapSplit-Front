'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import CountrySearchSection from '@/shared/components/steps/Step1_CountrySearch';
import { EditCountryPageProps } from './type';
import { Country } from '@/shared/types/country';
import { GetCountryTripDto } from '@/features/trip/createTrip/types/type';
import { editTripCountries, getTripCountries } from '../api/edit-trip-api';
import Loading from '@/shared/components/loading/Loading';

const EditCountryPage = ({ tripId }: EditCountryPageProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

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

  const { mutate } = useMutation({
    mutationFn: (selectedCountries: Country[]) => editTripCountries(tripId, selectedCountries),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['countryTrip', tripId] });
      queryClient.refetchQueries({ queryKey: ['tripBudget', tripId] });
      queryClient.refetchQueries({ queryKey: ['homeData'] });
      queryClient.refetchQueries({ queryKey: ['pastTrips'] });

      router.back();
    },
    onError: (err) => {
      console.error('여행지 수정 실패:', err);
      alert(`여행지 수정에 실패했습니다: ${err.message}`);
    },
  });

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

  const countries: Country[] = data.countries;

  const toggleCountry = (country: Country) => {
    setSelected((prev) =>
      prev.some((c) => c.countryId === country.countryId)
        ? prev.filter((c) => c.countryId !== country.countryId)
        : [...prev, country]
    );
  };

  const handleSave = () => {
    if (selected.length === 0) {
      alert('여행지를 1개 이상 선택해주세요.');
      return;
    }
    mutate(selected);
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
