import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // 인증이 필요한 경로 접근 시 토큰 검사
  const protectedPaths = ['/home', '/trip'];
  // const protectedPaths = [ '/trip'];
  const { pathname } = request.nextUrl;

  // 보호 경로에 해당하면 accessToken 쿠키 검사
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    const accessToken = request.cookies.get('accessToken')?.value;
    if (!accessToken) {
      // 로그인 페이지로 리다이렉트
      const loginUrl = new URL('/auth', request.url);
      // 현재 경로를 쿼리 파라미터로 추가하여 로그인 후 리다이렉트할 수 있도록 설정
      loginUrl.searchParams.set('redirect', `${pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 인증 필요 없는 경로는 그대로 진행
  return NextResponse.next();
}

// 미들웨어가 적용될 경로
export const config = {
  matcher: ['/home/:path*', '/trip/:path*'],
};