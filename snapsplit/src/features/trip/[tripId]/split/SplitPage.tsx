'use client'; // react-query는 클라이언트 컴포넌트에서 사용합니다.

import { useQuery } from '@tanstack/react-query';
import { getSplitData } from './api/split-api';

import Divider from '@/shared/components/Divider';
import TripHeader from '../../../../shared/components/TripHeader';
import SplitDatePickSection from './_components/SplitDatePickSection';
import SplitReciptCard from './_components/SplitReciptCard';
import { SplitPageProps } from './types/split-type';
import { convertSettlementToDays } from '@/shared/utils/DatetoDay/convertSettlementToDays';
import Loading from '@/shared/components/loading/Loading';

const SplitPage = ({ tripId }: SplitPageProps) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['splitData', tripId],
    queryFn: () => getSplitData(tripId),
  });

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-light_grey">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return <div>에러 발생: {error.message}</div>;
  }

  // API에서 받은 정산 완료 내역을 날짜 정보가 포함된 형태로 변환
  const convertedSettlements = data?.completeSettlement
    ? convertSettlementToDays(data.trip.startDate, data.completeSettlement)
    : [];

  return (
    <div className="h-screen w-full flex flex-col bg-light_grey">
      <TripHeader tripId={tripId} />
      <section className="flex flex-col px-5 py-6">
        <h1 className="text-head-1 pb-1">
          정산할 기간을 선택하면
          <br /> 정산 영수증을 뽑아드릴게요!
        </h1>
        <label className="pb-6 text-grey-550 text-body-2">영수증은 선택한 기간에 대해 1번만 생성 가능합니다</label>
        {data && (
          <SplitDatePickSection
            tripId={tripId}
            dailyExpenseStatus={data.dailyExpenseStatus}
            tripStartDate={data.trip.startDate}
          />
        )}
      </section>
      <Divider />
      <section className="flex flex-col gap-3 p-5 h-full">
        <h2 className="text-label-1">완료된 정산 영수증</h2>
        {convertedSettlements && convertedSettlements.length > 0 ? (
          convertedSettlements.map((settlement) => (
            <SplitReciptCard
              key={settlement.id}
              settlementId={settlement.id}
              startDate={settlement.startDate}
              endDate={settlement.endDate}
              startDay={settlement.startDay}
              endDay={settlement.endDay}
            />
          ))
        ) : (
          <p className="flex flex-1 h-full w-full justify-center items-center text-grey-550 pb-14">
            아직 정산 내역이 없어요!
          </p>
        )}
      </section>
    </div>
  );
};

export default SplitPage;
