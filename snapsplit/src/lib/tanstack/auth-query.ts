'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';

// 토큰 캐시 useQuery 훅
export const useAuthToken = () => {
  const queryClient = useQueryClient();

  // 토큰을 캐시에서 가져오는 useQuery 훅
  return useQuery({
    queryKey: ['authToken'], // Query Key
    queryFn: async () => {
      // 이미 캐시에 토큰이 저장되어 있다면 반환
      const cachedToken = queryClient.getQueryData<string>(['authToken']);
      if (cachedToken) {
        return cachedToken;
      }

      // 없으면 에러 반환 또는 null 처리
      throw new Error('토큰이 존재하지 않습니다.');
    },
    enabled: true,
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터가 신선하다고 간주
    retry: 3, // 토큰 조회 실패 시 재시도하지 않음
  });
};
