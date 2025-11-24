import BackButton from './_components/BackButton';

export default function NotFound() {
  return (
    <div className="flex flex-col w-full h-full justify-between bg-white p-5">
      <div className="flex-1 h-full pt-30">
        <h1 className="flex w-full justify-center text-4xl font-extrabold pb-6 text-primary">길을 잃었어요!</h1>
        <p className="flex w-full justify-center text-grey-550 text-label-2">SnapSplit 지도에 없는 장소예요.</p>
        <p className="flex w-full justify-center text-grey-550 text-label-2">
          홈으로 돌아가 새로운 여정을 시작해보세요!
        </p>
      </div>
      <BackButton />
    </div>
  );
}
