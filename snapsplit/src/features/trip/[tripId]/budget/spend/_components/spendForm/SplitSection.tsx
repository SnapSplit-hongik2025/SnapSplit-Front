import PaymentRow from "./payment/PaymentRow";

const tripMembers = [
    { id: 1, name: "김철수" },
    { id: 2, name: "이영희" },
    { id: 3, name: "박민수" },
];

export default function SplitSection() {
  return (
    <div className="flex flex-col items-center gap-3 w-full text-body-3">
      <div className="flex items-center justify-between w-full">
        <div>정산</div>
        <div className="flex items-center text-center">
          <div className="w-20">정산포함</div>
          <div className="w-20">부담금액</div>
        </div>
      </div>
      <div className="flex flex-col items-center w-full">
        {tripMembers.map((member) => (
          <PaymentRow key={member.id} name={member.name} />
        ))}
      </div>
    </div>
  );
}