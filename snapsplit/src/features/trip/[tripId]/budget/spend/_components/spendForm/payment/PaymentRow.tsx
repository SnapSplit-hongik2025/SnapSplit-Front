'use client';

import Image from 'next/image';
import { useState } from 'react';

type Props = {
    name: string;
}

export default function PaymentRow({ name }: Props) {
  const [isChecked, setIsChecked] = useState(false);

  const toggleCheck = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="flex items-center justify-between w-full py-2">
      <div>{name}</div>
      <div className="flex items-center">
        <div className="flex items-center justify-center w-20">
          <button onClick={toggleCheck} className={`flex items-center justify-center w-6 h-6 rounded-full ${isChecked ? 'bg-primary text-white' : 'border-[1px] border-grey-250'}`}>
            <Image src={isChecked ? "/svg/check-spend-white.svg" : "/svg/check-spend-grey.svg"} alt="" width={24} height={24} />
          </button>
        </div>
        <input type="text" className="flex items-center justify-center w-20 text-center text-grey-450" placeholder="0" />
      </div>
    </div>
  );
}
