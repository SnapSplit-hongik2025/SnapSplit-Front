import BackButton from './_components/BackButton';

export default function NotFound() {
  return (
    <div className="flex flex-col justify-between items-center h-screen bg-gradient-to-b from-[#001F3F] to-[#004466] text-white text-center pt-16 pb-12 px-6">
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold mb-4">404 - 미지의 여행지에 도착했어요 🗺️</h1>
        <p className="text-lg text-gray-300 mb-8">
          SnapSplit 지도에는 아직 없는 장소예요.
          <br />
          홈으로 돌아가 새로운 여정을 시작해봐요!
        </p>
      </div>

      <BackButton />
    </div>
  );
}
