import Link from 'next/link';
import Image from 'next/image';
import arrow from '@public/svg/arrow-left-grey-850.svg';

// components/BeforeRegistration.js
export default function BeforeRegistration() {
  return (
    <div className="flex flex-col bg-white min-h-[100dvh] px-5">
      <header className="py-3 flex items-center justify-between">
        <Link href="/my">
          <Image src={arrow} alt="exit" aria-label="홈으로" />
        </Link>
        <h1 className="text-label-1">나의 얼굴</h1>
        <div className="w-[25px]"></div>
      </header>

      {/* 중앙 컨텐츠 영역 */}
      <div className="flex flex-col items-center text-center space-y-4">
        <p className="text-start text-gray-600">
          아직 등록된 얼굴이 없어요. <br />
          얼굴을 등록하면 여행 사진에서 나를 자동으로 찾아줘요!
        </p>
        <div className="flex items-center justify-center w-32 h-32 bg-gray-100 border-1 border-dashed rounded-full">
          <span className="text-2xl font-bold text-gray-400">?</span>
        </div>
        <button className="w-full px-4 py-3 font-bold text-white bg-primary rounded-lg cursor-pointer">
          나의 얼굴 등록하기
        </button>
        <div className="flex w-full flex-col text-grey-550 p-4 bg-grey-50 rounded-lg border border-grey-350 items-start">
          <h3 className="font-semibold">높은 품질을 위한 tip</h3>
          <ul className="mt-2 text-sm list-disc list-inside">
            <li>얼굴을 가리지 않은 정면 사진</li>
            <li>단체사진이라면 잘라서 올려주세요</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// // components/AfterRegistration.js
// export function AfterRegistration() {
//   return (
//     <div className="w-full max-w-sm p-8 space-y-6 bg-white border rounded-lg shadow-sm">
//       {/* 중앙 컨텐츠 영역 */}
//       <div className="flex flex-col items-center text-center space-y-4">
//         <p className="text-gray-600">이 사진으로 나를 인식해요.</p>
//         <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-yellow-400">
//           {/* 등록된 사용자 얼굴 이미지가 여기에 들어갑니다. */}
//           <img
//             src="https://i.pravatar.cc/150?u=a042581f4e29026704d" // 예시 이미지
//             alt="Registered face"
//             className="object-cover w-full h-full"
//           />
//         </div>
//         <button className="w-full px-4 py-3 font-bold text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
//           나의 얼굴 변경하기
//         </button>
//       </div>
//       {/* 하단 주의사항 영역 */}
//       <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
//         <h3 className="font-semibold text-orange-800">주의</h3>
//         <p className="mt-2 text-sm text-orange-700">
//           기존에 태그된 사진들에는 적용되지 않아요. 업로드할 여행 사진들부터 변경된 얼굴로 인식해요.
//         </p>
//       </div>
//     </div>
//   );
// }
