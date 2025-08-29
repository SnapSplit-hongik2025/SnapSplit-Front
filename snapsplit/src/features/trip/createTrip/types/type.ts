import { Country } from "@/shared/types/country";

// STEP1 - 국가 목록 조회 API 응답 타입
export type GetCountryTripDto = {
  countries: Country[];
}

// CreateTripPage 내부 컴포넌트
export type CreateTripHeaderProps = {
  step: number;
  onPrev: () => void;
};

export type StepProgressBarProps = { step: number };
