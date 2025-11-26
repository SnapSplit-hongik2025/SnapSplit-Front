'use client';

import { useQuery } from '@tanstack/react-query';
import Button from '@/shared/components/Button';
import SettlementHeader from './_components/SettlementHeader';
import SettlementInfoSection from './_components/SettlementInfoSection';
import { SettlementPageProps } from './types/settlement-type';
import Divider from '@/shared/components/Divider';
import PersonalExpensesList from './_components/PersonalExpensesList';
import { getSettlementData } from './api/settlement-api';
import { GetSettlementDto } from './types/settlement-dto-type';
import Loading from '@/shared/components/loading/Loading';

// TypeScript 타입 정의
declare global {
  interface Window {
    Kakao: {
      init: (key: string | undefined) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (settings: KakaoShareSettings) => void;
      };
    };
  }
}

interface KakaoShareSettings {
  objectType: 'feed' | 'list' | 'location' | 'commerce' | 'text';
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  buttons?: Array<{
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }>;
}

const SettlementPage = ({ tripId, settlementId, startDay, endDay }: SettlementPageProps) => {
  const { data, isLoading, isError, error, isSuccess } = useQuery<GetSettlementDto, Error>({
    queryKey: ['settlement', tripId, settlementId],
    queryFn: () => getSettlementData(tripId, settlementId),
    enabled: !!tripId && !!settlementId,
  });

  // 1. 공유할 텍스트를 생성하는 함수
  const generateShareText = () => {
    if (!data) return '';

    const { settlementDetails } = data;

    let message = ``;
    message += `Day ${startDay} ~ Day ${endDay} 까지의 정산 내역이에요!\n\n`;

    message += `[보낼 돈]\n\n`;

    if (settlementDetails.length === 0) {
      message += `- 정산할 내역이 없습니다.\n`;
    } else {
      settlementDetails.forEach((detail) => {
        const senderName = detail.sender.name || '알수없음';
        const receiverName = detail.receiver.name || '알수없음';
        const amount = detail.amount.toLocaleString();

        message += `- ${senderName} → ${receiverName} : ${amount}원\n`;
      });
    }

    return message;
  };

  // 2. 카카오톡 공유 핸들러
  const handleKakaoShare = () => {
    // 안전장치: layout에서 초기화가 안 되었을 경우를 대비
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    }

    if (!window.Kakao || !window.Kakao.isInitialized()) {
      alert('카카오톡 공유 기능을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    if (!data) return;

    const { settlementDetails } = data;

    // 피드 메시지 설명 생성
    let description = `Day ${startDay} ~ Day ${endDay} 정산 내역입니다.\n\n[송금 목록]\n`;

    if (settlementDetails.length === 0) {
      description += '정산할 내역이 없습니다.';
    } else {
      settlementDetails.slice(0, 5).forEach((detail) => {
        const senderName = detail.sender.name || '알수없음';
        const receiverName = detail.receiver.name || '알수없음';
        const amount = detail.amount.toLocaleString();
        description += `• ${senderName} → ${receiverName} : ${amount}원\n`;
      });

      if (settlementDetails.length > 5) {
        description += `...외 ${settlementDetails.length - 5}건`;
      }
    }

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '💸 SNAP SPLIT 정산 영수증 도착!',
        description: description,
        // 실제 배포된 이미지 URL이나 유효한 URL을 넣어야 카톡에서 이미지가 보입니다.
        imageUrl:
          'https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_16x9.jpg?w=1200',
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: '정산 내역 자세히 보기',
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      ],
    });
  };

  // 3. 텍스트 복사 핸들러
  const handleCopyText = async () => {
    const text = generateShareText();
    try {
      await navigator.clipboard.writeText(text);
      alert('정산 내역이 클립보드에 복사되었습니다!');
    } catch (err) {
      console.error('복사 실패:', err); // err를 사용하므로 린트 에러 안 남
      alert('복사에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return <div>오류가 발생했습니다: {error.message}</div>;
  }

  return (
    <div className="h-screen w-full flex flex-col bg-light_grey overflow-y-auto scrollbar-hide">
      <section className="flex flex-col pt-2 pb-6 px-5">
        <SettlementHeader tripId={tripId} />
        {isSuccess && data && (
          <>
            <SettlementInfoSection
              members={data.members}
              endDay={endDay}
              startDay={startDay}
              settlementDetails={data.settlementDetails}
            />

            <div className="flex gap-2 w-full mt-4">
              <Button label="텍스트 복사" onClick={handleCopyText} bg="bg-grey-300 text-grey-800" className="flex-1" />
              <Button
                label="카카오톡 공유"
                onClick={handleKakaoShare}
                bg="bg-[#FEE500] text-[#191919]"
                className="flex-1"
              />
            </div>
          </>
        )}
      </section>
      {isSuccess && data && (
        <>
          <Divider />
          <section className="flex flex-col px-5 pt-6 pb-8 gap-3 w-full text-body-1 mb-[60px]">
            <PersonalExpensesList
              settlementId={settlementId}
              expenses={data.personalExpenses}
              totalAmount={data.totalAmount}
              tripId={tripId}
            />
          </section>
        </>
      )}
    </div>
  );
};

export default SettlementPage;
