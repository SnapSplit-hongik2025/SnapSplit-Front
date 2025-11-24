// TODO: 사진 데이터 props로 전달
export const mockPhotos: UploadedImage[] = [
  {
    id: '1-jisu-london',
    src: '/svg/1-jisu-london.png',
    tags: {
      days: [1],
      people: ['지수'],
      locations: ['런던'],
    },
  },
  {
    id: '2-jisu-na-yeon-paris',
    src: '/svg/2-jisu-na-yeon-paris.png',
    tags: {
      days: [2],
      people: ['지수', '나경', '연수'],
      locations: ['파리'],
    },
  },
  {
    id: '3-empty',
    src: '/svg/photo-loading.svg',
    tags: {
      days: [],
      people: [],
      locations: [],
    },
  },
  {
    id: '4-empty',
    src: '/svg/photo-loading.svg',
    tags: {
      days: [],
      people: [],
      locations: [],
    },
  },
  {
    id: '5-empty',
    src: '/svg/photo-loading.svg',
    tags: {
      days: [],
      people: [],
      locations: [],
    },
  },
  {
    id: '6-empty',
    src: '/svg/photo-loading.svg',
    tags: {
      days: [],
      people: [],
      locations: [],
    },
  },
  {
    id: '7-empty',
    src: '/svg/photo-loading.svg',
    tags: {
      days: [],
      people: [],
      locations: [],
    },
  },
  {
    id: '8-empty',
    src: '/svg/photo-loading.svg',
    tags: {
      days: [],
      people: [],
      locations: [],
    },
  },
  {
    id: '9-empty',
    src: '/svg/photo-loading.svg',
    tags: {
      days: [],
      people: [],
      locations: [],
    },
  },
  {
    id: '10-empty',
    src: '/svg/photo-loading.svg',
    tags: {
      days: [],
      people: [],
      locations: [],
    },
  },
  {
    id: '11-empty',
    src: '/svg/photo-loading.svg',
    tags: {
      days: [],
      people: [],
      locations: [],
    },
  },
  {
    id: '12-empty',
    src: '/svg/photo-loading.svg',
    tags: {
      days: [],
      people: [],
      locations: [],
    },
  },
  {
    id: '13-empty',
    src: '/svg/photo-loading.svg',
    tags: {
      days: [],
      people: [],
      locations: [],
    },
  },
  {
    id: '14-empty',
    src: '/svg/photo-loading.svg',
    tags: {
      days: [],
      people: [],
      locations: [],
    },
  },
  {
    id: '15-empty',
    src: '/svg/photo-loading.svg',
    tags: {
      days: [],
      people: [],
      locations: [],
    },
  },
  {
    id: '16-empty',
    src: '/svg/photo-loading.svg',
    tags: {
      days: [],
      people: [],
      locations: [],
    },
  },
  {
    id: '17-empty',
    src: '/svg/photo-loading.svg',
    tags: {
      days: [],
      people: [],
      locations: [],
    },
  },
  {
    id: '18-empty',
    src: '/svg/photo-loading.svg',
    tags: {
      days: [],
      people: [],
      locations: [],
    },
  },
  {
    id: '19-empty',
    src: '/svg/photo-loading.svg',
    tags: {
      days: [],
      people: [],
      locations: [],
    },
  },
];

export type UploadedImage = {
  id: string;
  src: string;
  tags: {
    days: number[];
    people: string[];
    locations: string[];
  };
};