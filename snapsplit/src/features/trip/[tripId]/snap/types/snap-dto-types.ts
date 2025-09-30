// 여행 정보 조회 API 응답 타입
export interface GetTripDataDto {
  tripId: number;
  tripName: string;
  startDate: string;
  endDate: string;
  countries: string[];
  memberProfileImages: string[];
}

export interface UploadImageDto {
  data: {
    photoId: number;
    photoUrl: string;
    taggedUsers: {
      userId: number;
      userName: string;
    }[];
  }[];
}

export interface GetPhotosDto {
  photos: {
    photoId: number;
    photoUrl: string;
    photoDate: string;
    taggedUsers: {
      userId: number;
      name: string;
    }[];
  }[];
}
