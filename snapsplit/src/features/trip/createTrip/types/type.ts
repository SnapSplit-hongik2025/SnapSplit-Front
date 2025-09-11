import { Country } from "@/shared/types/country";

// STEP1 - 국가 목록 조회 API 응답 타입
export type GetCountryTripDto = {
  countries: Country[];
}

// STEP3 - 유저 검색 API 응답 타입
export interface GetUserCodeDto {
    id: number,
    name: string,
    profileImage: string,
}

// CreateTripPage 내부 컴포넌트
export type CreateTripHeaderProps = {
  step: number;
  onPrev: () => void;
};

export type StepProgressBarProps = { step: number };

// 여행 생성 요청 DTO
export interface CreateTripRequestDto {
  tripName: string;
  countries: Country[];
  startDate: string;
  endDate: string;
  usersId: number[];
}

// 여행 생성 응답 DTO
export type CreateTripResponseDto = {
  tripId: number;
  createdAt: string;
}