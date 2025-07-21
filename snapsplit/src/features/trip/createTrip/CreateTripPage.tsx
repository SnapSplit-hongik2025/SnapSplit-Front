'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import StepProgressBar from '@trip/createTrip/_components/StepProgressBar';
import CreateTripHeader from '@trip/createTrip/_components/CreateTripHeader';
import CountrySearchSection from '@trip/createTrip/steps/Step1_CountrySearch';
import SelectDateSection from './steps/Step2_SelectDate';
import AddMemberSection from '@trip/createTrip/steps/Step3_AddMember';
import InputTripNameSection from './steps/Step4_InputTripName';
import { routerPath } from '@/shared/constants/routePath';
import { Country } from '@/shared/types/country';

// steps로 단계별 컴포넌트를 랜더링해주는 Multi Step Form 페이지
export default function CreateTripPage() {
  const router = useRouter();

  // 현재 진행 중인 스탭
  const [step, setStep] = useState(1);

  // 국가 데이터 상태
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);

  // 여행 날짜 상태
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // JSON에서 국가 목록 로딩
  useEffect(() => {
    fetch('/mocks/countries.json')
      .then((res) => res.json())
      .then((json) => setCountries(json.data));
  }, []);

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

  // 스탭마다 랜더링 할 컴포넌트들을 배열로 관리
  const steps = [
    <CountrySearchSection
      key="step1"
      countries={countries}
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
    <div className="min-h-[100dvh]">
      <CreateTripHeader step={step} onPrev={handlePrevStep} />
      <StepProgressBar step={step} />
      {steps[step - 1]}
    </div>
  );
}
