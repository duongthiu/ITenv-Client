/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', '!./src/**/*.tdc.tsx'],
  theme: {
    extend: {
      colors: {
        'primary-color': '#21a1d3',
        'primary-color-hover': '#48bae0',
        'danger-color': '#D1293D',
        'danger-color-hover': '#BA1B2E',
        'danger-color-disabled': '#F76F7F',
        
        'color-border': '#d2ddec',
        'grey-color': '#f6f6f6',
        'color-border-primary': '#2c7be5',
        'text-primary-color': '#21a1d3',
        'success-color': '#52c41a',
        'link-color': '#1890ff',
        'warning-color': '#faac19',
        'error-color': '#f5222d',
        'background-drawer': '#f7f8fa',
        // 'text-color': '#465060',
        'color-icon': '#64748b',
        'black-color': '#1f2937',
        'background-color-primary': '#21a1d3',
        'background-primary-color-hover': '#48bae0',

        'color-label': '#105672',
        'color-hover': '#2d2d2d',
        'background-color-edit': '#ebf4f7',
        'background-color-option': '#f9fbfd',
        'border-color': '#d2ddec',
        'background-hover': '#d7e8f7',
        'background-primary-button': '#5e5adb',
        'bg-primary-button-hover': '#4945C4',
        'bg-primary-button-disabled': '#9E9BF5',
        'line-color': '#EBEEFA',
        'focus-color': '#5E5ADB',
        'color-button': '#9a9ba0',
        'background-color-input': '#f8f9fc',

        'page-title-color': '#222834',
        'tooltip-background': '#171C26',
        'sidebar-background': '#151357',
        'sidebar-background-hover': '#2A278F',
        'sidebar-background-selected': '#0D0B45',
        'sidebar-text-color': '#B9B6FA',
        'text-color': '#464F60',
        'text-bold-color': '#171C26',
        'text-disable-color': '#868FA0',
        'text-disable-primary': '#EDEDFC',
        'text-disable-red': '#FCC5CB',
        'button-default-border': '#E1E3E6',
        'button-default-border-hover': '#C4C7CC',
        'button-default-disable-background': '#F7F9FC',
        'button-default-disable-border': '#DADCDF',
        'button-primary-border': '#5653C9',
        'button-primary-border-hover': '#4945C4',
        'button-primary-disable-background': '#9E9BF5',
        'button-primary-disable-border': '#9391E5',
        'button-danger-border': '#D92D20',
        'button-danger-border-hover': '#A9192A',
        'button-danger-disable-border': '#E06573',
        'input-border': '#E5E8ED',
        'input-border-hover': '#CACED7',
        'input-disable-background': '#F7F9FC',
        'input-disable-border': '#DCDFE6',
        'text-label-color': '#e6e6ff',

        //LIST COLOR CONFIG
        'primary-gray': {
          25: '#FCFCFD',
          50: '#F9FAFB',
          100: '#F2F4F7',
          200: '#EAECF0',
          300: '#D0D5DD',
          400: '#98A2B3',
          500: '#667085',
          600: '#475467',
          700: '#344054',
          800: '#1D2939',
          900: '#101828'
        },
        'primary-brand': {
          25: '#FCFAFF',
          50: '#F9F5FF',
          100: '#F4EBFF',
          200: '#E9D7FE',
          300: '#D6BBFB',
          400: '#B692F6',
          500: '#9E77ED',
          600: '#7F56D9',
          700: '#6941C6',
          800: '#53389E',
          900: '#42307D'
        },
        'primary-error': {
          25: '#FFFBFA',
          50: '#FEF3F2',
          100: '#FEE4E2',
          200: '#FECDCA',
          300: '#FDA29B',
          400: '#F97066',
          500: '#F04438',
          600: '#D92D20',
          700: '#B42318',
          800: '#912018',
          900: '#7A271A'
        },
        'primary-warning': {
          25: '#FFFCF5',
          50: '#FFFAEB',
          100: '#FEF0C7',
          200: '#FEDF89',
          300: '#FEC84B',
          400: '#FDB022',
          500: '#F79009',
          600: '#DC6803',
          700: '#B54708',
          800: '#93370D',
          900: '#7A2E0E'
        },
        'primary-success': {
          25: '#F6FEF9',
          50: '#ECFDF3',
          100: '#D1FADF',
          200: '#A6F4C5',
          300: '#6CE9A6',
          400: '#32D583',
          500: '#12B76A',
          600: '#039855',
          700: '#027A48',
          800: '#05603A',
          900: '#054F31'
        },

        'second-blue-gray': {
          25: '#FCFCFD',
          50: '#F8F9FC',
          100: '#EAECF5',
          200: '#D5D9EB',
          300: '#AFB5D9',
          400: '#717BBC',
          500: '#4E5BA6',
          600: '#3E4784',
          700: '#363F72',
          800: '#293056',
          900: '#101323'
        },
        'second-blue-light': {
          25: '#F5FBFF',
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#B9E6FE',
          300: '#7CD4FD',
          400: '#36BFFA',
          500: '#0BA5EC',
          600: '#0086C9',
          700: '#026AA2',
          800: '#065986',
          900: '#0B4A6F'
        },
        'second-blue': {
          25: '#F5FAFF',
          50: '#EFF8FF',
          100: '#D1E9FF',
          200: '#B2DDFF',
          300: '#84CAFF',
          400: '#53B1FD',
          500: '#2E90FA',
          600: '#1570EF',
          700: '#175CD3',
          800: '#1849A9',
          900: '#194185'
        },
        'second-indigo': {
          25: '#F5F8FF',
          50: '#EEF4FF',
          100: '#E0EAFF',
          200: '#C7D7FE',
          300: '#A4BCFD',
          400: '#8098F9',
          500: '#6172F3',
          600: '#444CE7',
          700: '#3538CD',
          800: '#2D31A6',
          900: '#2D3282'
        },
        'second-purple': {
          25: '#FAFAFF',
          50: '#F4F3FF',
          100: '#EBE9FE',
          200: '#D9D6FE',
          300: '#BDB4FE',
          400: '#9B8AFB',
          500: '#7A5AF8',
          600: '#6938EF',
          700: '#5925DC',
          800: '#4A1FB8',
          900: '#3E1C96'
        },
        'second-pink': {
          25: '#FEF6FB',
          50: '#FDF2FA',
          100: '#FCE7F6',
          200: '#FCCEEE',
          300: '#FAA7E0',
          400: '#F670C7',
          500: '#EE46BC',
          600: '#DD2590',
          700: '#C11574',
          800: '#9E165F',
          900: '#851651'
        },
        'second-rose': {
          25: '#FFF5F6',
          50: '#FFF1F3',
          100: '#FFE4E8',
          200: '#FECDD6',
          300: '#FEA3B4',
          400: '#FD6F8E',
          500: '#F63D68',
          600: '#E31B54',
          700: '#C01048',
          800: '#A11043',
          900: '#89123E'
        },
        'second-orange': {
          25: '#FFFAF5',
          50: '#FFF6ED',
          100: '#FFEAD5',
          200: '#FDDCAB',
          300: '#FEB273',
          400: '#FD853A',
          500: '#FB6514',
          600: '#EC4A0A',
          700: '#C4320A',
          800: '#9C2A10',
          900: '#7E2410'
        },
        background: {
          light: 'hsl(0 0% 100%)',
          dark: 'hsl(229 84% 5%)'
        },
        foreground: {
          light: 'hsl(229 84% 5%)',
          dark: 'hsl(210 40% 98%)'
        },
        card: {
          light: 'hsl(0 0% 100%)',
          dark: 'hsl(229 84% 5%)'
        },
        'card-foreground': {
          light: 'hsl(229 84% 5%)',
          dark: 'hsl(210 40% 98%)'
        }
      },

      flex: {
        2: '2 2 0%',
        3: '3 3 0%',
        4: '4 4 0%',
        5: '5 5 0%',
        6: '6 6 0%',
        7: '7 7 0%',
        8: '8 8 0%',
        9: '9 9 0%'
      },
      borderRadius: {
        '4xl': '2rem'
      }
    },
    screens: {
      phone: { max: '46.1875em' },
      tablet: { min: '46.25em', max: '63.9375em' },
      small_desktop: { min: '64em', max: '125em' },
      desktop: { min: '125em' }
    }
  },
  plugins: [],
  important: true
};
