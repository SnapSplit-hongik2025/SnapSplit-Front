export type ButtonProps = {
  label: string;
  onClick?: () => void;
  enabled?: boolean;
  className?: string;
  bg?: string; // ex: 'bg-red-500'
};

export default function Button({ label, onClick, enabled = true, className = '', bg }: ButtonProps) {
  const baseStyle = 'rounded-xl w-full py-[14px] text-white';
  const bgStyle = bg ? bg : enabled ? 'bg-primary' : 'bg-light_green_deep';
  const cursorStyle = enabled ? 'cursor-pointer' : 'cursor-not-allowed';

  return (
    <button
      onClick={enabled ? onClick : undefined}
      className={`${baseStyle} ${bgStyle} ${cursorStyle} ${className}`}
      disabled={!enabled}
    >
      {label}
    </button>
  );
}
