// String으로 들어온 통화를 실제 단위로 변경해주는 훅

const currencyMap: Record<string, string> = {
    KRW: '₩',
    USD: '$',
    EUR: '€',
    JPY: '¥',
  };
  
export function useCurrencySymbol(currencyCode: string): string {
  // 입력값이 없으면 빈 문자열 반환
  if (!currencyCode) {
    return '';
  }

  // 대문자로 변환하여 일관성 유지
  const code = currencyCode.toUpperCase();

  // 맵에서 심볼을 찾고, 없으면 공백 반환
  return currencyMap[code] || '';
  }
