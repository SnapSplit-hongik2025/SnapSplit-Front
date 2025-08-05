// axios 인스턴스 생성 함수

import axios from 'axios';

const createAxiosInstance = () => {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export default createAxiosInstance;
