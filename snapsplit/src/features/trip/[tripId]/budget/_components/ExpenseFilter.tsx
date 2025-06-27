import Image from 'next/image';
import filter from '@public/svg/filter.svg';

const ExpenseFilter = () => {
  return (
    <div className="flex w-full py-3 px-5 justify-end items-center">
      <Image alt="filter" src={filter} className="cursor-pointer" />
    </div>
  );
};

export default ExpenseFilter;
