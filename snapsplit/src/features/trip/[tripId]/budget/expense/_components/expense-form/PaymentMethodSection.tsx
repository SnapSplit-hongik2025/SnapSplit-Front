'use client';

import { EXPENSE_METHOD } from '@/shared/constants/expense';
import { useState } from 'react';

export default function PaymentMethodSection() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-start w-full gap-3">
      <div className="text-body-3">지불 방법</div>
      <div className="flex items-center gap-3 w-full">
        {EXPENSE_METHOD.map((method) => (
          <button
            key={method.name}
            onClick={() => setSelectedMethod(method.name)}
            className={`flex items-center gap-3 w-full h-12 px-4 rounded-xl ${selectedMethod === method.name ? 'bg-primary text-white' : 'border-[1px] border-grey-250'}`}
          >
            <div className="flex-1 text-body-3">{method.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
