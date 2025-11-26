'use client';

import Image from 'next/image';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { getParsedReceipt } from '@/features/trip/[tripId]/budget/expense/receipt/api/receipt-api';
import { useReceiptStore } from '@/lib/zustand/useReceiptStore';
import { ReceiptItem } from '@/lib/zustand/useReceiptStore';
import { OcrResponse } from '@/features/trip/[tripId]/budget/expense/receipt/api/receipt-api';
import { OcrResult } from '@/lib/zustand/useReceiptStore';
import Loading from '@/shared/components/loading/Loading';

export default function ReceiptRegisterButton() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const tripId = params.tripId as string;
  const date = searchParams.get('date') as string;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const { setOcrResult, setReceiptUrl } = useReceiptStore();

  const openCamera = () => {
    inputRef.current?.click();
  };

  const mapOcrResponseToResult = (response: OcrResponse): OcrResult => {
    if (!response) return null;

    return {
      currency: response.currency,
      totalAmount: response.totalAmount,
      receiptUrl: response.receiptUrl,
      items: response.items.map(
        (item, index): ReceiptItem => ({
          id: index + 1,
          name: item.name,
          amount: item.amount,
        })
      ),
    };
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);

    try {
      const ocrResult = await getParsedReceipt(file);
      const refined = mapOcrResponseToResult(ocrResult);

      setOcrResult(refined);
      setReceiptUrl(ocrResult.receiptUrl);

      router.push(`/trip/${tripId}/budget/expense/receipt?date=${date}`);
    } catch (err) {
      console.error(err);
      alert('영수증 인식에 실패했습니다. 다시 시도해주세요!');
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="fixed top-0 left-0 h-screen w-full flex items-center justify-center bg-black/50">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onFileChange}
      />
      <button
        className="flex items-center justify-center gap-1 w-full h-11 bg-primary rounded-xl cursor-pointer disabled:opacity-60"
        onClick={openCamera}
        disabled={loading}
        aria-busy={loading}
      >
        <Image src="/svg/snap-white.svg" alt="사진 등록" width={24} height={24} />
        <div className="text-body-1 text-white">{loading ? '업로드 중...' : '영수증으로 등록'}</div>
      </button>
    </>
  );
}
