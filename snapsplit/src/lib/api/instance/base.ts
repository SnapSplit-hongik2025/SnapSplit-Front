// axios 인스턴스 생성 함수

import axios from 'axios';

const createAxiosInstance = () => {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true, // 쿠키 포함
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/* 기본 fetch 예시

await fetch('/auth/kakao/login?code=...', {
  method: 'POST',
  credentials: 'include', // 쿠키 포함
  // ...other options
});

*/


export default createAxiosInstance;
