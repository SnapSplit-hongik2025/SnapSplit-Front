// TODO: api 데이터로 변경
type BudgetOverviewProps = {
  label: string;
  amount: number;
  symbol: string;
};

const mockdata: BudgetOverviewProps[] = [
  {
    label: '미국 - USD(달러)',
    amount: 321.7,
    symbol: '$',
  },
  {
    label: '일본 - JPY(엔)',
    amount: 321.7,
    symbol: '¥',
  },
];

const BudgetOverview = () => {
  return (
    <div className="flex flex-col items-center w-full px-5 py-4.5 bg-grey-850">
      {mockdata.map((item, index) => (
        <div className="flex items-center justify-between w-full py-1" key={index}>
          <div className="text-body-1 text-grey-450">{item.label}</div>
          <div className="text-label-1 text-white">
            {item.amount}
            {item.symbol}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BudgetOverview;
