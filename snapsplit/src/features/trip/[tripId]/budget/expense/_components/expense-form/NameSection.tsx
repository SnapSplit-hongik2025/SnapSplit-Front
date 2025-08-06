'use client';

import { useExpenseStore } from '@/lib/zustand/useExpenseStore';

export default function NameSection() {
  const { setExpenseName } = useExpenseStore();

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpenseName(e.target.value);
  };

  return (
    <div className="flex flex-col items-start w-full gap-3">
      <div className="text-body-3">지출명</div>
      <input
        type="text"
        className="w-full h-12 px-4 rounded-xl border-[1px] border-grey-250 text-body-3"
        placeholder="내용을 입력해주세요"
        onChange={onChangeName}
      />
    </div>
  );
}
