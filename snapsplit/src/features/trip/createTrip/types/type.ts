import { Country } from '@/shared/types/country';

// CreateTripPage 내부 컴포넌트
export type CreateTripHeaderProps = {
  step: number;
  onPrev: () => void;
};

export type StepProgressBarProps = { step: number };

// STEP1 - 국가 목록 조회 API 응답 타입
export type GetCountryTripDto = Country[];

// STEP3 - 유저 검색 API 응답 타입
export interface UserInfoDto {
  id: number;
  name: string;
  profileImage: string;
}

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
}[];

export interface CreateTripRequestDto {
  tripName: string;
  countries: { countryId: number; countryName: string }[];
  startDate: string; // ISO 8601 형식의 날짜 문자열
  endDate: string; // ISO 8601 형식의 날짜 문자열
  usersId: number[];
}
