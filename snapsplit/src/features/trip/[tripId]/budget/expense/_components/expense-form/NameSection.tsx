'use client';

import { useCallback, type ChangeEvent } from 'react';

type Props = {
  expenseName: string;
  setExpenseName: (expenseName: string) => void;
}

export default function NameSection({ expenseName, setExpenseName }: Props) {
  const onChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setExpenseName(e.target.value);
  }, [setExpenseName]);

  return (
    <div className="flex flex-col items-start w-full gap-3">
      <label className="text-body-3" htmlFor="expense-name">지출명</label>
      <input
        type="text"
        className="w-full h-12 px-4 rounded-xl border-[1px] border-grey-250 text-body-3"
        placeholder="내용을 입력해주세요"
        id="expense-name"
        onChange={onChangeName}
        value={expenseName}
      />
    </div>
  );
}
