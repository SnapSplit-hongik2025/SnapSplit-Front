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

// [타입 정의는 그대로 유지]
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

  // 2. 카카오톡 공유 핸들러 (디버깅 강화 버전)
  const handleKakaoShare = () => {
    try {
      // [디버깅 1] window.Kakao 객체 존재 확인
      if (!window.Kakao) {
        alert('Error: window.Kakao 객체를 찾을 수 없습니다. 스크립트 로딩 실패.');
        return;
      }

      // [디버깅 2] API 키 확인
      const apiKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
      if (!apiKey) {
        alert('Error: 환경변수 NEXT_PUBLIC_KAKAO_JS_KEY가 비어있습니다.');
        return;
      }

      // 초기화 시도
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(apiKey);
      }

      // [디버깅 3] 초기화 후 상태 확인
      if (!window.Kakao.isInitialized()) {
        alert('Error: Kakao.init() 실패. 유효하지 않은 키이거나 이미 다른 키로 초기화되었습니다.');
        return;
      }

      if (!data) {
        alert('Error: 공유할 데이터(data)가 아직 로드되지 않았습니다.');
        return;
      }

      // [디버깅 4] 현재 도메인 확인
      const currentUrl = window.location.href;
      // [수정] 사용하지 않는 currentOrigin 변수 삭제 (Lint Error 해결)

      const { settlementDetails } = data;

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

      // 카카오톡 공유 실행
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: '💸 SNAP SPLIT 정산 영수증 도착!',
          description: description,
          imageUrl:
            'https://snapsplit-assets.s3.ap-northeast-2.amazonaws.com/photos/44721b30-a5aa-46e4-900c-11efd2580996_KakaoTalk_Photo_2025-11-27-10-47-53.png',
          link: {
            mobileWebUrl: currentUrl,
            webUrl: currentUrl,
          },
        },
        buttons: [
          {
            title: '정산 내역 자세히 보기',
            link: {
              mobileWebUrl: currentUrl,
              webUrl: currentUrl,
            },
          },
        ],
      });
    } catch (err) {
      // [수정] ': any' 제거 (Lint Error 해결)
      alert(`실행 중 에러 발생: ${JSON.stringify(err)}`);
      console.error(err);
    }
  };

  // 3. 텍스트 복사 핸들러
  const handleCopyText = async () => {
    const text = generateShareText();
    try {
      await navigator.clipboard.writeText(text);
      alert('정산 내역이 클립보드에 복사되었습니다!');
    } catch (err) {
      console.error('복사 실패:', err);
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

            <div className="flex gap-2 w-full">
              <button
                onClick={handleCopyText}
                className="cursor-pointer text-[15px] border-1 border-grey-350 text-grey-650 bg-grey-50 rounded-xl w-full py-[14px] flex-1"
              >
                텍스트 복사하기
              </button>
              <Button label="카카오톡 공유하기" onClick={handleKakaoShare} className="flex-1" />
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
