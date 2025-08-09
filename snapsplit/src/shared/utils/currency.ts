export function getKorName(currencyCode: string): string {
  return currencyMap[currencyCode].KorName;
}

export function getNation(currencyCode: string): string {
  return currencyMap[currencyCode].nation;
}

export function getSymbol(currencyCode: string): string {
  return currencyMap[currencyCode].symbol;
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
