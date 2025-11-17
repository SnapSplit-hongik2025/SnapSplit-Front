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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createTrip, getCountryTrip } from './api/create-trip-api';
import { UserInfoDto } from './types/type';
import { useAuthStore } from '@/lib/zustand/useAuthStore';
import Loading from '@/shared/components/loading/Loading';

// 뮤테이션 페이로드 타입 정의
type CreateTripPayload = {
  tripData: {
    tripName: string;
    countries: Country[];
    startDate: string;
    endDate: string;
    usersId: number[]; // (userId가 number 타입이라고 가정)
  };
  imageFile: File | null;
};

// steps로 단계별 컴포넌트를 랜더링해주는 Multi Step Form 페이지
export default function CreateTripPage() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const queryClient = useQueryClient();

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
    select: (responseData) => {
      // 이 배열을 컴포넌트가 기대하는 { countries: [...] } 객체 형태로 만들어서 반환
      return { countries: responseData };
    },
  });

  // 여행 생성을 위한 useMutation 정의
  const { mutate: createTripMutation, isPending: isCreatingTrip } = useMutation({
    mutationFn: (payload: CreateTripPayload) => createTrip(payload.tripData, payload.imageFile),
    onSuccess: (res) => {
      // 성공 시, 관련 쿼리 무효화 (리패치)
      queryClient.invalidateQueries({ queryKey: ['homeData'] });
      queryClient.invalidateQueries({ queryKey: ['pastTrips'] });

      // 생성된 여행 홈으로 이동
      const TripId = res[0].tripId;
      router.push(`${routerPath.trip.href(TripId)}/budget`);
    },
    onError: (err: any) => {
      alert(err.message || '여행 생성에 실패했습니다.');
      console.error(err);
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
      if (isCreatingTrip) return; // 중복 제출 방지

      const allUserIds = [...selectedUsers.map((user) => user.id), ...(user && user.userCode ? [user.userId] : [])];

      const tripData = {
        tripName,
        countries: selectedCountries,
        startDate: startDate ? startDate.toISOString().split('T')[0] : '',
        endDate: endDate ? endDate.toISOString().split('T')[0] : '',
        usersId: allUserIds,
      };

      createTripMutation({
        tripData: tripData,
        imageFile: tripImageFile,
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
      countries={data.countries}
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

  if (isCreatingTrip) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <CreateTripHeader step={step} onPrev={handlePrevStep} />
      <StepProgressBar step={step} />
      <div className="flex flex-col w-full h-full">{steps[step - 1]}</div>
    </div>
  );
}
