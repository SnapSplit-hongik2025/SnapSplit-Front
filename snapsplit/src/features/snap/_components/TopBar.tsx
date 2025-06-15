export default function TopBar() {
    return (
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold">유luv여행</h1>
        <div className="mt-2 flex gap-2 text-sm text-grey-550">
          <span className="border px-2 py-1 rounded-full">런던</span>
          <span className="border px-2 py-1 rounded-full">파리</span>
          <span className="border px-2 py-1 rounded-full">취리히</span>
        </div>
        <p className="mt-1 text-sm text-grey-450">4명 · 2025.4.7 - 4.12</p>
      </div>
    );
  }
  