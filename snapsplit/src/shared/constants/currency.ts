export type Currency = {
  code: string;
  name: string;
  label: string;
};

export const CURRENCY_LIST: Currency[] = [
    {
        code: 'KRW',
        name: 'KRW(원)',
        label: '한국 - KRW(원)',
    },
    {
        code: 'USD',
        name: 'USD(달러)',
        label: '미국 - USD(달러)',
    },
    {
        code: 'EUR',
        name: 'EUR(유로)',
        label: '유럽 - EUR(유로)',
    },
    {
        code: 'JPY',
        name: 'JPY(엔)',
        label: '일본 - JPY(엔)',
    },
];
