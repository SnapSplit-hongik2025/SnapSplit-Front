// api 호출 함수 정의부
// 데이터 반환만 처리

import publicInstance from "./instance/publicInstance";

export const kakaoLogin = async (code: string): Promise<KakaoLoginResponse> => {
    try {
        const res = await publicInstance.post<KakaoLoginResponse>(`/auth/kakao/login?code=${code}`);
        return res.data;
    } catch (error) {
        console.error("카카오 로그인 실패 : ", error);
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
    }
}