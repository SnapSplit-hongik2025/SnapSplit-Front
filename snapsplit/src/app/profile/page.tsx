'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function Profile() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>로딩 중…</p>;
  }

  if (!session) {
    return (
      <div>
        <p>로그인되지 않았습니다.</p>
        <button onClick={() => signIn('kakao')}>카카오 로그인</button>
      </div>
    );
  }

  return (
    <div>
      <p>안녕하세요, {session.user?.name}님!</p>
      <p>이메일: {session.user?.email}</p>
      <p>이미지: {session.user?.image}</p>
      <button onClick={() => signOut()}>로그아웃</button>
    </div>
  );
}
