// 인증이 필요한 API 요청을 위한 axios 인스턴스

import createAxiosInstance from './base';
import { useAuthStore } from '@/lib/zustand/useAuthStore';
import { reissueToken } from '../auth';

const privateInstance = createAxiosInstance();

privateInstance.interceptors.request.use(
  (config) => {
    const getToken = useAuthStore.getState().getToken; // getToken 함수 가져오기
    const { accessToken } = getToken(); // accessToken 가져오기
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// TODO: refresh 구현하기
let isRefreshing = false;
let failedQueue: (() => void)[] = [];

privateInstance.interceptors.response.use(
  (response) => response.data, // 2XX 응답은 그대로 반환

  async (error) => {
    const originalRequest = error.config;

    // 실패한 요청이 refresh 토큰을 요청하는 요청이었다면 -> 재시도 없이 토큰 삭제, 로그아웃, 에러 반환
    if (originalRequest.url?.includes('/auth/token/refresh')) {
      useAuthStore.getState().clearUser();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // access token 만료 등으로 401 에러를 받은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          failedQueue.push(() => {
            resolve(privateInstance(originalRequest)); // 실패한 요청을 재시도 큐에 추가
          });
        });
      }

      // 재시도 플래그 설정
      originalRequest._retry = true;
      isRefreshing = true;

      // refresh token 가져오기
      try {
        const refreshToken = useAuthStore.getState().getToken().refreshToken;
        if (!refreshToken) throw new Error('Refresh token not found');

        // refresh token으로 access token 재발급
        const tokenPair = await reissueToken(refreshToken);
        useAuthStore.getState().setToken(tokenPair.accessToken, refreshToken);

        originalRequest.headers['Authorization'] = `Bearer ${tokenPair.accessToken}`; // header 재설정

        // 재시도 큐 실행
        failedQueue.forEach((fn) => fn());
        failedQueue = [];

        return privateInstance(originalRequest); // 재시도 결과 반환
      } catch (error) {
        useAuthStore.getState().clearUser();
        window.location.href = '/login';
        return Promise.reject(error);
      } finally {
        // 재시도 플래그 초기화
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default privateInstance;
