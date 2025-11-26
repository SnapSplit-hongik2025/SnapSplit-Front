export {};

declare global {
  interface Window {
    Kakao: {
      init: (key: string | undefined) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (settings: KakaoShareSettings) => void;
      };
    };
  }
}

// 전역으로 사용할 수 있도록 export 하지 않고 전역 스코프에 두거나,
// 필요한 파일에서만 쓰려면 interface를 export 해도 됩니다.
// 여기서는 편의상 global 안에 같이 정의하거나 별도 interface로 둡니다.
interface KakaoShareSettings {
  objectType: 'feed' | 'list' | 'location' | 'commerce' | 'text';
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  buttons?: Array<{
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }>;
}