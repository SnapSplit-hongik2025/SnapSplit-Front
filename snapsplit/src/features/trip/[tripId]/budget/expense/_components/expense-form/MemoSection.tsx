'use client';

import { useExpenseStore } from '@/lib/zustand/useExpenseStore';
import { useCallback, type ChangeEvent } from 'react';

export default function MemoSection() {
  const expenseMemo = useExpenseStore((s) => s.expenseMemo);
  const setExpenseMemo = useExpenseStore((s) => s.setExpenseMemo);

  const onChangeMemo = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setExpenseMemo(e.target.value);
  }, [setExpenseMemo]);

  return (
    <div className="flex flex-col items-start w-full gap-3">
      <label className="text-body-3" htmlFor="expense-memo">지출 설명</label>
      <input
        type="text"
        className="w-full h-12 px-4 rounded-xl border-[1px] border-grey-250 text-body-3"
        placeholder="내용을 입력해주세요"
        id="expense-memo"
        onChange={onChangeMemo}
        value={expenseMemo}
      />
    </div>
  );
}
