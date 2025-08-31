import { SettlementFlowCardProps } from '../types/settlement-type';

export default function SettlementFlowCard({
  className,
  SettlementDetailDto: settlementDetails,
  type,
}: SettlementFlowCardProps) {
  const label = type === 'send' ? '보낼 돈' : type === 'receive' ? '받을 돈' : '';

  return (
    <div className={`flex w-full flex-col bg-white rounded-xl p-4 gap-2 ${className}`}>
      <h3 className="text-body-2 text-grey-550">{label}</h3>
      {settlementDetails && settlementDetails.length > 0
        ? settlementDetails.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-body-1">
              <span>{type === 'send' ? item.receiver?.name : type === 'receive' ? item.sender?.name : ''}</span>
              <span>{item.amount.toLocaleString()}원</span>
            </div>
          ))
        : null}
    </div>
  );
}
