import Image from 'next/image';
import devider from '@public/svg/devider.svg';

type ExpenseDateBarProps = {
  expenseDay: string; // ex. '여행준비' or '4.7(월)'
  type: 'PRE_TRIP' | 'IN_TRIP';
  dayIndex?: number;
};

const ExpenseDateBar = ({ expenseDay, type, dayIndex }: ExpenseDateBarProps) => {
  const mainLabel = type === 'IN_TRIP' && dayIndex !== undefined ? `Day ${dayIndex}` : expenseDay;

  const subLabel = type === 'IN_TRIP' && dayIndex !== undefined ? expenseDay : null;

  return (
    <div className="flex gap-2 items-center">
      <p className="text-body-1 text-grey-850">{mainLabel}</p>
      {subLabel && (
        <>
          <Image alt="구분선" src={devider} />
          <p className="text-body-1 text-grey-550">{subLabel}</p>
        </>
      )}
    </div>
  );
};

export default ExpenseDateBar;
