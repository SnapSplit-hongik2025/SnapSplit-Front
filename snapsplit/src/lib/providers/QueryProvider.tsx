'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

interface QueryProviderProps {
  children: React.ReactNode;
  showDevtools?: boolean;
}

export default function QueryProvider({ children, showDevtools = false }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,    // 5분
            retry: 1,
            refetchOnMount: false,       // 마운트 시 재요청 방지
            refetchOnWindowFocus: false, // 포커스 복귀 시 재요청 방지
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {showDevtools && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}