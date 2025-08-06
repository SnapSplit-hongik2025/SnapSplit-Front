export default function DescriptionSection() {
  return (
    <div className="flex flex-col items-start w-full gap-3">
      <div className="text-body-3">지출 설명</div>
      <input
        type="text"
        className="w-full h-12 px-4 rounded-xl border-[1px] border-grey-250 text-body-3"
        placeholder="내용을 입력해주세요"
      />
    </div>
  );
}
