// TODO: CurrencyCode 타입 정의
// TODO: 공용 통화를 사용하는 국가에 대한 문제 - 고유한 id 필요

type Currency = {
    KorName: string;
    symbol: string;
    nation: string;
}

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
  GBP: {
    KorName: '파운드',
    symbol: '£',
    nation: '영국'
  },
  CHF: {
    KorName: '프랑',
    symbol: '₣',
    nation: '스위스'
  },
  CZK: {
    KorName: '코루나',
    symbol: 'Kč',
    nation: '체코'
  },
  HUF: {
    KorName: '포린트',
    symbol: 'Ft',
    nation: '헝가리'
  },
  PLN: {
    KorName: '즈워티',
    symbol: 'zł',
    nation: '폴란드'
  },
  DKK: {
    KorName: '크로네',
    symbol: 'kr',
    nation: '덴마크'
  },
  NOK: {
    KorName: '크로네',
    symbol: 'kr',
    nation: '노르웨이'
  },
  SEK: {
    KorName: '크로나',
    symbol: 'kr',
    nation: '스웨덴'
  },
  ISK: {
    KorName: '크로나',
    symbol: 'kr',
    nation: '아이슬란드'
  },
  TRY: {
    KorName: '리라',
    symbol: '₺',
    nation: '터키'
  },
  CAD: {
    KorName: '달러',
    symbol: '$',
    nation: '캐나다'
  },
  MXN: {
    KorName: '페소',
    symbol: '$',
    nation: '멕시코'
  },
  BRL: {
    KorName: '헤알',
    symbol: 'R$',
    nation: '브라질'
  },
  ARS: {
    KorName: '페소',
    symbol: '$',
    nation: '아르헨티나'
  },
  CLP: {
    KorName: '페소',
    symbol: '$',
    nation: '칠레'
  },
  AUD: {
    KorName: '달러',
    symbol: '$',
    nation: '호주'
  },
  NZD: {
    KorName: '달러',
    symbol: '$',
    nation: '뉴질랜드'
  },
  CNY: {
    KorName: '위안',
    symbol: '¥',
    nation: '중국'
  },
  HKD: {
    KorName: '달러',
    symbol: '$',
    nation: '홍콩'
  },
  TWD: {
    KorName: '달러',
    symbol: 'NT$',
    nation: '대만'
  },
  THB: {
    KorName: '밧',
    symbol: '฿',
    nation: '태국'
  },
  VND: {
    KorName: '동',
    symbol: '₫',
    nation: '베트남'
  },
  MYR: {
    KorName: '링깃',
    symbol: 'RM',
    nation: '말레이시아'
  },
  SGD: {
    KorName: '달러',
    symbol: '$',
    nation: '싱가포르'
  },
  IDR: {
    KorName: '루피아',
    symbol: 'Rp',
    nation: '인도네시아'
  },
  PHP: {
    KorName: '페소',
    symbol: '₱',
    nation: '필리핀'
  },
  INR: {
    KorName: '루피',
    symbol: '₹',
    nation: '인도'
  },
  AED: {
    KorName: '디르함',
    symbol: 'د.إ',
    nation: '아랍에미리트'
  },
  SAR: {
    KorName: '리얄',
    symbol: '﷼',
    nation: '사우디아라비아'
  },
  QAR: {
    KorName: '리얄',
    symbol: '﷼',
    nation: '카타르'
  },
  ZAR: {
    KorName: '랜드',
    symbol: 'R',
    nation: '남아프리카공화국'
  },
  MAD: {
    KorName: '디르함',
    symbol: 'د.م.',
    nation: '모로코'
  },
  EGP: {
    KorName: '파운드',
    symbol: 'E£',
    nation: '이집트'
  },
  ILS: {
    KorName: '셰켈',
    symbol: '₪',
    nation: '이스라엘'
  },
  MVR: {
    KorName: '루피야',
    symbol: 'Rf',
    nation: '몰디브'
  },
  FJD: {
    KorName: '달러',
    symbol: '$',
    nation: '피지'
  }
};
