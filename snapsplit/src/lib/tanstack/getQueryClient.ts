import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

// 싱글톤
const getQueryClient = cache(() => new QueryClient());
export default getQueryClient;
