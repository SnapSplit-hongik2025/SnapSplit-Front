'use client';

import Image from 'next/image';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { getParsedReceipt } from '@/features/trip/[tripId]/budget/expense/receipt/api/receipt-api';
import { useReceiptStore } from '@/lib/zustand/useReceiptStore';
import { ReceiptItem } from '@/lib/zustand/useReceiptStore';
import { OcrResponse } from '@/features/trip/[tripId]/budget/expense/receipt/api/receipt-api';
import { OcrResult } from '@/lib/zustand/useReceiptStore';

export default function ReceiptRegisterButton() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const tripId = params.tripId as string;
  const date = searchParams.get('date') as string;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const { setOcrResult, setReceiptUrl, setCurrency } = useReceiptStore();

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
          amount: String(item.amount),
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
      console.log("[refined]: ", refined);

      setOcrResult(refined);
      setReceiptUrl(URL.createObjectURL(file));
      setCurrency(ocrResult.currency);

      router.push(`/trip/${tripId}/budget/expense/receipt?date=${date}`);
    } catch (err) {
      console.error(err);
      alert('영수증 인식에 실패했어. 다시 시도해줘!');
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

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

/** 이미지 크기 줄이는 헬퍼 */
async function downscaleIfNeeded(file: File, maxSide: number): Promise<File> {
  if (!file.type.startsWith('image/')) return file;

  const imgBitmap = await createImageBitmap(file).catch(() => null);
  if (!imgBitmap) return file;

  const { width, height } = imgBitmap;
  const scale = Math.min(1, maxSide / Math.max(width, height));
  if (scale >= 1) return file;

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);

  const ctx = canvas.getContext('2d');
  if (!ctx) return file;

  ctx.drawImage(imgBitmap, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.9));
  if (!blob) return file;

  return new File([blob], file.name || 'receipt.jpg', { type: 'image/jpeg' });
}
