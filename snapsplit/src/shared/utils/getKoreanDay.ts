import dayjs from 'dayjs';

// 입력받은 date를 요일로 변경
export const getKoreanDay = (date: dayjs.Dayjs): string => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[date.day()];
};
