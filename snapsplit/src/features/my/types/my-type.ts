export type GetMyResponseDto = {
  name: string;
  profileImageUrl: string;
  userCode: string;
};

export type UpdateMyRequestDto = {
  name?: string;
  profileImage?: File;
  onProgress?: (percent: number) => void; // 업로드 진행률
};
