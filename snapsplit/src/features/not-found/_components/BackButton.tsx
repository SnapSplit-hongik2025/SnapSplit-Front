'use client';

const BackButton = () => {
  return (
    <button
      onClick={() => window.history.back()}
      className="px-6 py-3 rounded-xl cursor-pointer bg-primary text-white text-label-1"
    >
      이전으로 돌아가기
    </button>
  );
};

export default BackButton;
