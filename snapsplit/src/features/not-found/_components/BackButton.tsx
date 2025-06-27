'use client';

const BackButton = () => {
  return (
    <button
      onClick={() => window.history.back()}
      className="px-6 py-3 rounded-xl cursor-pointer bg-[#00FFD1] text-black font-semibold shadow-md hover:brightness-110 transition"
    >
      이전으로 돌아가기
    </button>
  );
};

export default BackButton;
