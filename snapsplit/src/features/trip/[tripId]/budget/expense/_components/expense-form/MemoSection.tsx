'use client';

import { useCallback, type ChangeEvent } from 'react';

type Props = {
  expenseMemo: string;
  setExpenseMemo: (expenseMemo: string) => void;
}

export default function MemoSection({ expenseMemo, setExpenseMemo }: Props) {
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
