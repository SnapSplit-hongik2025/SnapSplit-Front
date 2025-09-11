'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import StepProgressBar from '@trip/createTrip/_components/StepProgressBar';
import CreateTripHeader from '@trip/createTrip/_components/CreateTripHeader';
import CountrySearchSection from '@/shared/components/steps/Step1_CountrySearch';
import SelectDateSection from '@/shared/components/steps/Step2_SelectDate';
import AddMemberSection from '@/shared/components/steps/Step3_AddMember';
import InputTripNameSection from '@/shared/components/steps/Step4_InputTripName';
import { routerPath } from '@/shared/constants/routePath';
import { Country } from '@/shared/types/country';
import { useQuery } from '@tanstack/react-query';
import { getCountryTrip } from './api/create-trip-api';

// steps로 단계별 컴포넌트를 랜더링해주는 Multi Step Form 페이지
export default function CreateTripPage() {
  const router = useRouter();

  // 현재 진행 중인 스탭
  const [step, setStep] = useState(1);

  // 국가 데이터 상태
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);

  // 여행 날짜 상태
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // 국가 선택/해제 토글
  const toggleCountry = (country: { countryId: number; countryName: string }) => {
    setSelectedCountries((prev) =>
      prev.some((c) => c.countryId === country.countryId)
        ? prev.filter((c) => c.countryId !== country.countryId)
        : [...prev, country]
    );
  };

  // 스탭 이동
  const handleNextStep = () => {
    if (step === 4) {
      // 마지막 단계라면 여행 생성하고 생성된 여행 홈으로 이동
      // 백엔드 API data로 받아오도록 수정하기
      const TripId = 1;
      router.push(`${routerPath.trip.href(TripId)}/budget`);
    } else {
      // 다음 스텝으로 이동
      setStep((prev) => prev + 1);
    }
  };
  const handlePrevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // 국가 목록 조회 API
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['countryList'],
    queryFn: () => getCountryTrip(),
  });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>에러 발생: {error.message}</div>;
  }

  if (!data) {
    return <div>데이터가 없습니다.</div>;
  }

  // 스탭마다 랜더링 할 컴포넌트들을 배열로 관리
  const steps = [
    <CountrySearchSection
      key="step1"
      countries={data ?? []}
      selected={selectedCountries}
      onToggle={toggleCountry}
      onClick={handleNextStep}
    />,
    <SelectDateSection
      key="step2"
      startDate={startDate}
      endDate={endDate}
      setStartDate={setStartDate}
      setEndDate={setEndDate}
      onClick={handleNextStep}
    />,
    <AddMemberSection key="step3" onClick={handleNextStep} />,
    <InputTripNameSection key="step4" onClick={handleNextStep} />,
  ];

  return (
    <div className="flex flex-col h-screen">
      <CreateTripHeader step={step} onPrev={handlePrevStep} />
      <StepProgressBar step={step} />
      <div className="flex flex-col w-full h-full">{steps[step - 1]}</div>
    </div>
  );
}
