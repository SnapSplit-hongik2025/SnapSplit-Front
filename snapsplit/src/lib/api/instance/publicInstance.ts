// 인증이 필요하지 않은 API 요청을 위한 axios 인스턴스

import createAxiosInstance from "./base";

const publicInstance = createAxiosInstance();

export default publicInstance;