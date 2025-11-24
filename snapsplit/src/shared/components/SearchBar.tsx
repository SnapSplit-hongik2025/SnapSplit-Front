import { SearchBarProps } from '@/shared/types/ui';

const SearchBar = ({ placeholder, value, onChange, className }: SearchBarProps) => {
  return (
    <div className={`flex w-full rounded-xl bg-grey-150 items-center justify-center pr-4 ${className || ''}`}>
      <input
        className="flex w-full py-[13px] px-4 outline-none text-body-2"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;
