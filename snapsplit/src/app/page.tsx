import { redirect } from 'next/navigation';

// 화면 처음 접속 시 landing 페이지로 바로 리다이렉트
export default function Home() {
  redirect('/landing');
}
