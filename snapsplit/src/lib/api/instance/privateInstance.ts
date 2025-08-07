// 인증이 필요한 API 요청을 위한 axios 인스턴스

import createAxiosInstance from "./base";
import { useAuthStore } from "@/lib/zustand/useAuthStore";

const privateInstance = createAxiosInstance();

privateInstance.interceptors.request.use(
    (config) => {
        const getToken = useAuthStore.getState().getToken;  // getToken 함수 가져오기
        const { accessToken } = getToken(); // accessToken 가져오기
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
            console.log("[로그인 시도] Access Token:", accessToken);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// TODO: refresh 구현하기

export default privateInstance;