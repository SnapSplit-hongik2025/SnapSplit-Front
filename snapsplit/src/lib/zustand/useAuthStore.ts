import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/shared/types/auth';

type AuthState = {
  user: User | null; // 현재 로그인한 유저의 상태를 담음
  isLoggedIn: boolean; // 로그인 여부 체크 -> 미들웨어 등에 사용
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: User | null) => void; // 유저 상태 업데이트 함수
  clearUser: () => void;
  setToken: (accessToken: string, refreshToken: string) => void;
  getToken: () => { accessToken: string | null; refreshToken: string | null };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      accessToken: null,
      refreshToken: null,

      // 로그인 시 user와 함께 isLoggedIn 업데이트
      setUser: (user) =>
        set({
          user,
          isLoggedIn: !!user,
        }),

      // 로그아웃 시 초기화
      clearUser: () =>
        set({
          user: null,
          isLoggedIn: false,
        }),

      setToken: (accessToken, refreshToken) =>
        set({
          accessToken,
          refreshToken,
        }),
      
      getToken: () => {
        return {
          accessToken: get().accessToken,
          refreshToken: get().refreshToken,
        };
      },
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
