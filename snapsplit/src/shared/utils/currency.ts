// TODO: CurrencyCode 타입 정의

export function getKorName(currencyCode: string): string {
  const entry = currencyMap[currencyCode];
  if (!entry) return currencyCode;
  return entry.KorName;
}

export function getNation(currencyCode: string): string {
  const entry = currencyMap[currencyCode];
  if (!entry) return currencyCode;
  return entry.nation;
}

export function getSymbol(currencyCode: string): string {
  const entry = currencyMap[currencyCode];
  if (!entry) return currencyCode;
  return entry.symbol;
}

const currencyMap: Record<string, Currency> = {
  KRW: {
    KorName: '원',
    symbol: '₩',
    nation: '한국'
  },
  USD: {
    KorName: '달러',
    symbol: '$',
    nation: '미국'
  },
  EUR: {
    KorName: '유로',
    symbol: '€',
    nation: '유럽'
  },
  JPY: {
    KorName: '엔',
    symbol: '¥',
    nation: '일본'
  },
};

type Currency = {
    KorName: string;
    symbol: string;
    nation: string;
}
