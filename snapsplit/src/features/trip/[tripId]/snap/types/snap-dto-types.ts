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

export interface PhotoResponse {
  photoId: number;
  photoUrl: string;
  photoDate: string;
  taggedUsers: {
    userId: number;
    name: string;
  }[];
}

export interface GetPhotosDto {
  photos: PhotoResponse[];
  currentPage: number;
  last: boolean;
}

export interface GetReadinessDto {
  allMembersRegistered: boolean;
  members: {
    userId: number;
    name: string;
    profileImageUrl: string;
    hasFaceData: boolean;
    currentUser: boolean;
  }[];
}

export interface Folder {
  name: string;
  id: number;
}
