export default function PaymentMethodSection() {
  return (
    <div className="flex flex-col items-start w-full gap-3">
      <div className="text-body-3">지불 방법</div>
      <div className="flex items-center gap-3 w-full">
        <button className="flex items-center gap-3 w-full h-12 px-4 rounded-xl border-[1px] border-grey-250">
          <div className="flex-1 text-body-3">현금</div>
        </button>
        <button className="flex items-center gap-3 w-full h-12 px-4 rounded-xl border-[1px] border-grey-250">
          <div className="flex-1 text-body-3">카드</div>
        </button>
      </div>
    </div>
  );
}
