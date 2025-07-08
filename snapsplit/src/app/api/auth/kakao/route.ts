import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: '인가 코드가 필요합니다.' },
        { status: 400 }
      );
    }

    // 백엔드 API 호출
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const backendResponse = await fetch(`${backendUrl}/api/auth/kakao/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { error: errorData.message || '로그인에 실패했습니다.' },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();

    // 백엔드에서 받은 JWT 토큰을 쿠키에 저장
    const response = NextResponse.json(
      { message: '로그인 성공' },
      { status: 200 }
    );

    // JWT 토큰을 쿠키에 저장 (백엔드 응답에 따라 조정)
    if (data.accessToken) {
      response.cookies.set('accessToken', data.accessToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7일
      });
    }

    if (data.refreshToken) {
      response.cookies.set('refreshToken', data.refreshToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30일
      });
    }

    return response;

  } catch (error) {
    console.error('카카오 로그인 API 에러:', error);
    return NextResponse.json(
      { error: '서버 에러가 발생했습니다.' },
      { status: 500 }
    );
  }
} 