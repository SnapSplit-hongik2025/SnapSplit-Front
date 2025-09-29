/**
 * 'yyyy-mm-dd' 문자열을 로컬 타임존 기준 Date로 변환
 * (UTC 파싱으로 인한 하루 밀림 방지)
 */
export function parseYMD(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(Number);
  if (!y || !m || !d) throw new Error(`Invalid ymd string: ${ymd}`);
  // 로컬 타임존의 자정으로 생성
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

/**
 * 여행 시작일 대비 Day X 포맷 생성
 * - 기본: 시작일이 Day 1
 * - 이전 날짜도 허용(음수 Day)하려면 allowNegative=true
 */
export function toDayX(
  dateStr: string,
  tripStartDateStr: string,
  options?: { base?: 0 | 1; allowNegative?: boolean }
): string {
  const base = options?.base ?? 1; // Day 1 시작이 기본
  const allowNegative = options?.allowNegative ?? true;

  const d = parseYMD(dateStr);
  const start = parseYMD(tripStartDateStr);

  // 두 날짜 모두 "정오"로 맞춰 DST 등 엣지 영향 최소화
  d.setHours(12, 0, 0, 0);
  start.setHours(12, 0, 0, 0);

  const MS_PER_DAY = 86_400_000;
  const diffDays = Math.round((d.getTime() - start.getTime()) / MS_PER_DAY);

  let dayNumber = base + diffDays; // base=1이면 시작일이 1, 다음날 2 ...
  if (!allowNegative && dayNumber < base) {
    dayNumber = base; // 음수 금지 시 시작일 이전은 모두 Day base로 고정
  }
  return `Day ${dayNumber}`;
}

/**
 * M.DD(W) 형식으로 변환 (예: 9.03(화))
 * - M: 1~12 (0 패딩 없음)
 * - DD: 01~31 (0 패딩)
 * - W: 요일 한 글자 (월화수목금토일)
 * - 기본 로케일: 한국어
 */
export function toMDotDDW(dateStr: string, locale: string = 'ko-KR'): string {
  const d = parseYMD(dateStr);
  const month = d.getMonth() + 1;
  const day = String(d.getDate()).padStart(2, '0');

  // 요일 한 글자
  const weekdayShortKo = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
  // 필요 시 로케일에 따른 요일명 커스터마이즈 가능 (현재는 ko 고정)
  const w = locale.startsWith('ko') ? weekdayShortKo : new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(d);

  return `${month}.${day}(${w})`;
}
