'use client';

import CurrencyButton from './CurrencyButton';
import ReceiptRegisterButton from './ReceiptRegisterButton';
import BottomSheet from '@/shared/components/bottom-sheet/BottomSheet';
import CurrencyBottomSheet from '@/features/trip/[tripId]/budget/shared/_components/CurrencyBottomSheet';
import { useState } from 'react';

export default function SpendInputCard() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState('USD(달러)');
  return (
    <div className="flex flex-col items-center gap-4 w-full px-5 py-4 rounded-xl bg-grey-150">
      <div className="flex flex-col items-start justify-between w-full gap-3">
        <CurrencyButton onClick={() => setIsOpen(true)} />
        <div className="flex flex-col items-start justify-between gap-1 w-full">
            <input type="text" className="w-full text-head-0" placeholder="금액 입력" />
            <div className="text-body-3 text-grey-550">= 0원</div>
        </div>
      </div>
      <ReceiptRegisterButton />
      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <CurrencyBottomSheet
          onClose={() => setIsOpen(false)}
          selectedCurrency={selectedCurrency}
          setCurrency={setSelectedCurrency}
        />
      </BottomSheet>
    </div>
  );
}
