export type FilterState = {
    days: number[];
    people: string[];
    locations: string[];
};

export type UploadedImage = {
    id: string;
    src: string;
    tags: {
      days: number[];
      people: string[];
      locations: string[];
    };
  };

export type ActiveTab = '전체' | '폴더별';