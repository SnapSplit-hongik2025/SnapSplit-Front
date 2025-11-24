interface ExpenseDetailInfoItemProps {
  label: string;
  value: string;
}

export default function ExpenseDetailInfoItem({ label, value }: ExpenseDetailInfoItemProps) {
  return (
    <div className="flex justify-between items-center text-body-2">
      <span className="text-grey-550">{label}</span>
      <span>{value}</span>
    </div>
  );
}
