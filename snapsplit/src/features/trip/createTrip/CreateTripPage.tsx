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
import { createTrip, getCountryTrip } from './api/create-trip-api';
import { UserInfoDto } from './types/type';
import { useAuthStore } from '@/lib/zustand/useAuthStore';

// steps로 단계별 컴포넌트를 랜더링해주는 Multi Step Form 페이지
export default function CreateTripPage() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  // 현재 진행 중인 스탭
  const [step, setStep] = useState(1);

  // 국가 데이터 상태
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);

  // 여행 날짜 상태
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // 동행 유저 상태
  const [selectedUsers, setSelectedUsers] = useState<UserInfoDto[]>([]);

  const [tripName, setTripName] = useState<string>('');
  const [tripImageUrl, setTripImageUrl] = useState<string | null>(null);
  const [tripImageFile, setTripImageFile] = useState<File | null>(null);

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

      const allUserIds = [...selectedUsers.map((user) => user.id), ...(user && user.userCode ? [user.userId] : [])];

      createTrip(
        {
          tripName,
          countries: selectedCountries,
          startDate: startDate ? startDate.toISOString().split('T')[0] : '',
          endDate: endDate ? endDate.toISOString().split('T')[0] : '',
          usersId: allUserIds,
        },
        tripImageFile
      )
        .then((res) => {
          const TripId = res.tripId;
          router.push(`${routerPath.trip.href(TripId)}/budget`);
        })
        .catch((err) => {
          alert(err.message);
        });
    } else {
      setStep((prev) => prev + 1);
    }
  };
  const handlePrevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // 각 스탭 컴포넌트
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
    <AddMemberSection
      key="step3"
      selectedUsers={selectedUsers}
      setSelectedUsers={setSelectedUsers}
      onClick={handleNextStep}
    />,
    <InputTripNameSection
      key="step4"
      onClick={handleNextStep}
      tripName={tripName}
      setTripName={setTripName}
      tripImageUrl={tripImageUrl}
      setTripImageUrl={setTripImageUrl}
      setTripImageFile={setTripImageFile}
    />,
  ];

  return (
    <div className="flex flex-col h-screen">
      <CreateTripHeader step={step} onPrev={handlePrevStep} />
      <StepProgressBar step={step} />
      <div className="flex flex-col w-full h-full">{steps[step - 1]}</div>
    </div>
  );
}
