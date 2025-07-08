import { redirect } from 'next/navigation';

// 화면 처음 접속 시 landing 페이지로 바로 리다이렉트
// 로그인 시에는 여행홈으로 리다이렉트
// 추후 로그인 여부에 따라 조건부 리다이렉트 구현 예정
export default function Home() {
  redirect('/landing');
}
