type SelectButtonProps = {
  isSelected: boolean;
  onClick: () => void;
  label?: string;
};

const SelectButton = ({ isSelected, onClick, label = '선택' }: SelectButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full border text-body-2 font-medium cursor-pointer
      ${isSelected ? 'bg-primary border-primary text-white' : 'border-grey-250 text-grey-450'}`}
      aria-label={isSelected ? `${label} 선택 취소` : `${label} 선택`}
    >
      {label}
    </button>
  );
};

export default SelectButton;
