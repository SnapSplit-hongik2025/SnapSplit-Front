interface DividerProps {
  className?: string;
  p?: string;
}

export default function Divider({ p = 'py-[3px]', className = '' }: DividerProps) {
  return <div className={`flex w-full bg-grey-250 ${p} ${className}`}></div>;
}
