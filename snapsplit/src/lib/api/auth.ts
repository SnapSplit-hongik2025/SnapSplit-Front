// api 호출 함수 정의부
// 데이터 반환만 처리

import publicInstance from './instance/publicInstance';
import { ApiEnvelope, TokenPair } from './type';

export const kakaoLogin = async (code: string): Promise<KakaoLoginResponse> => {
  try {
    const res = await publicInstance.post<KakaoLoginResponse>(`/auth/kakao/login?code=${code}`);
    return res.data;
  } catch (error) {
    console.error('카카오 로그인 실패 : ', error);
    throw error;
  }
};

type KakaoLoginResponse = {
  status: number;
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    userId: number;
    name: string;
    profileImage: string;
    userCode: string;
  };
};

export const reissueToken = async (refreshToken: string): Promise<TokenPair> => {
  try {
    const envelope = await publicInstance.post<ApiEnvelope<TokenPair>>(`/auth/token/refresh`, {
      refreshToken,
    }).then((res) => res.data);
    return envelope.data;
  } catch (error) {
    console.error('토큰 재발급 실패 : ', error);
    throw error;
  }
};