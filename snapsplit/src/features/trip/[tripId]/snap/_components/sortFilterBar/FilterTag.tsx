type FilterTagProps = {
  label: string;
};

function FilterTag({ label }: FilterTagProps) {
  return (
    <div className="flex-shrink-0 flex justify-center items-center bg-primary px-3 h-7 rounded-full text-body-2 text-white">{label}</div>
  );
}

export default FilterTag;
