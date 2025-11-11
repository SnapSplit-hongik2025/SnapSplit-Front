export default function TipInfoBox() {
  return (
    <div className="flex w-full flex-col gap-1 text-grey-550 p-4 bg-grey-50 rounded-lg border border-grey-350 items-start">
      <h3 className="font-semibold">나의 얼굴 tip</h3>
      <p className="text-body-2">얼굴을 가리지 않은 정면 사진으로 올려주세요.</p>
      <p className="text-body-2">기존에 태그된 사진들에는 적용되지 않아요.</p>
    </div>
  );
}
