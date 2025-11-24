import { TotalAmountInfoProps } from '../types/settlement-member-type';

export default function TotalAmountInfo({ name, totalAmount }: TotalAmountInfoProps) {
  return (
    <div className="px-5 py-3 text-head-1">
      {name === '공동경비' ? '이번 여행에서 공동경비로' : `${name}님은 이번 여행에서`}
      <br />
      <span className="text-primary">{totalAmount.toLocaleString('ko-KR')}원</span>을 썼어요!
    </div>
  );
}
