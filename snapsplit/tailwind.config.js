/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}', './features/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
        cal: ['var(--font-cal-sans)']
      },
      fontSize: {
        'head-0': ['24px', { lineHeight: '36px', letterSpacing: '0', fontWeight: '600' }],
        'head-1': ['20px', { lineHeight: '30px', letterSpacing: '-0.015em', fontWeight: '600' }],
        'title-1': ['18px', { lineHeight: '27px', letterSpacing: '-0.015em', fontWeight: '600' }],
        'title-2': ['18px', { lineHeight: '27px', letterSpacing: '-0.015em', fontWeight: '500' }],
        'label-1': ['16px', { lineHeight: '24px', letterSpacing: '-0.015em', fontWeight: '600' }],
        'label-2': ['16px', { lineHeight: '24px', letterSpacing: '-0.015em', fontWeight: '500' }],
        'body-1': ['14px', { lineHeight: '21px', letterSpacing: '-0.015em', fontWeight: '600' }],
        'body-2': ['14px', { lineHeight: '21px', letterSpacing: '-0.015em', fontWeight: '400' }],
        'caption-1': ['12px', { lineHeight: '18px', letterSpacing: '-0.015em', fontWeight: '500' }],
        'caption-2': ['12px', { lineHeight: '18px', letterSpacing: '-0.015em', fontWeight: '400' }],
      },
      colors: {
        primary: '#41D596',
        dark_green: '#14B470',
        light_green: '#41d5961a',
        light_green_deep: '#BCF0DA',
        pale_green: '#E6F9F1',
        light_grey: '#F5F5F5',
        bg_green: '#DFF5EC',
        green: '#2ecd89',
        black: '#0C0D11',
        white: '#FFFFFF',
        grey: {
          1000: '#1A1A1A',
          850: '#3A3A3A',
          750: '#545454',
          650: '#6E6E6E',
          550: '#8E8E8E',
          450: '#BDBEBD',
          350: '#DDDDDD',
          250: '#E8E8E8',
          150: '#F3F3F3',
          50: '#FAFAFA',
        },
      },
      zIndex: {
        base: 0,
        navbar: 10,
        dropdown: 20,
        floating: 30,
        backdrop: 40,
        overlay: 50,
        fullscreen: 60,
        toast: 100,
      },
    },
  },
  plugins: [],
};
