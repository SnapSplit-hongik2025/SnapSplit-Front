'use client';
import Button from '@/shared/components/Button';

export default function ReceiptForm() {
 
  return (
    <div className="flex-1 flex flex-col items-center w-full pt-5 px-5">
      <div className="text-title-1 w-full pb-4">영수증 정보가 맞나요?</div>
      <div className="flex flex-col items-center w-full gap-6">
        
      </div>
      <div className="flex items-center justify-center w-full py-5">
        <Button
          label="다음으로"
          onClick={() => {}}
          enabled={true}
        />
      </div>
    </div>
  );
}
