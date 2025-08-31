import Divider from '@/shared/components/Divider';
import TripHeader from '../../../../shared/components/TripHeader';
import SplitDatePickSection from './_components/SplitDatePickSection';
import SplitReciptCard from './_components/SplitReciptCard';
import { SplitPageProps } from './types/split-type';
import { getSplittableDateList } from '@/shared/utils/getSplittableDateList';
import mock from '@public/mocks/split-mock.json';
import { convertSettlementToDays } from '@/shared/utils/DatetoDay/convertSettlementToDays';

const SplitPage = ({ tripId }: SplitPageProps) => {
  console.log('SplitPage tripId:', tripId);

  // 정산 영수증 선택 가능 날짜 필터링 리스트
  const selectableDates = getSplittableDateList(
    mock.data.trip.startDate,
    mock.data.trip.endDate,
    mock.data.completeSettlement
  );

  // 완료된 정산 영수증 Date -> Day 변환
  const convertedSettlements = convertSettlementToDays(mock.data.trip.startDate, mock.data.completeSettlement);

  return (
    <div className="h-screen w-full flex flex-col bg-light_grey">
      <TripHeader tripId={tripId} />
      <section className="flex flex-col px-5 py-6">
        <h1 className="text-head-1 pb-1">
          정산할 기간을 선택하면
          <br /> 정산 영수증을 뽑아드릴게요!
        </h1>
        <label className="pb-6 text-grey-550 text-body-2">영수증은 선택한 기간에 대해 1번만 생성 가능합니다</label>
        <SplitDatePickSection selectableDates={selectableDates} tripStartDate={mock.data.trip.startDate} />
      </section>
      <Divider />
      <section className="flex flex-col gap-3 p-5">
        <h2 className="text-label-1">완료된 정산 영수증</h2>
        {convertedSettlements.map((settlement) => (
          <SplitReciptCard
            key={settlement.id}
            settlementId={settlement.id}
            startDate={settlement.startDate}
            endDate={settlement.endDate}
            startDay={settlement.startDay}
            endDay={settlement.endDay}
          />
        ))}
      </section>
    </div>
  );
};

export default SplitPage;
