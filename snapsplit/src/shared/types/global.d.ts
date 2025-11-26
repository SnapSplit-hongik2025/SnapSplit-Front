// src/types/global.d.ts

export {}; // 이 파일이 모듈로 인식되게 함

declare global {
  interface Window {
    Kakao: any; // 또는 구체적인 타입 정의
  }
}