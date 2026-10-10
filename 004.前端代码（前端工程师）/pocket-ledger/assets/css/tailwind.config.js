// Pocket Ledger — Shared Tailwind config
// 来源：原 _1/_2/_3/_4/_5 每个 HTML 内嵌的 tailwind.config 抽取而来
// 与 docs/DESIGN.md 中的色板/字体/间距 token 保持一致
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary-container': '#4fb3a9',
        'surface-container': '#e3efff',
        'tertiary-container': '#e68d6d',
        'surface': '#f7f9ff',
        'error': '#ba1a1a',
        'secondary-fixed': '#d8e5e3',
        'on-error-container': '#93000a',
        'surface-container-high': '#d9eaff',
        'surface-container-lowest': '#ffffff',
        'on-primary-container': '#00413c',
        'on-primary-fixed-variant': '#00504a',
        'secondary': '#55615f',
        'surface-dim': '#c9dcf3',
        'mint-surface': '#F4FAF9',
        'on-tertiary': '#ffffff',
        'outline': '#6e7977',
        'tertiary-fixed-dim': '#ffb59b',
        'surface-bright': '#f7f9ff',
        'on-primary-fixed': '#00201d',
        'tertiary': '#924a2f',
        'on-secondary': '#ffffff',
        'on-surface': '#091d2e',
        'on-secondary-fixed-variant': '#3d4948',
        'on-secondary-container': '#5b6765',
        'warm-amber': '#F39C12',
        'on-tertiary-fixed-variant': '#75331a',
        'on-primary': '#ffffff',
        'primary-fixed': '#92f3e8',
        'pure-white': '#FFFFFF',
        'surface-tint': '#006a63',
        'on-tertiary-fixed': '#380d00',
        'soft-rose': '#E74C3C',
        'outline-variant': '#bdc9c6',
        'primary-fixed-dim': '#75d7cc',
        'inverse-surface': '#203243',
        'secondary-fixed-dim': '#bcc9c7',
        'tertiary-fixed': '#ffdbcf',
        'background': '#f7f9ff',
        'inverse-primary': '#75d7cc',
        'surface-variant': '#d1e4fb',
        'surface-container-highest': '#d1e4fb',
        'primary': '#006a63',
        'secondary-container': '#d8e5e3',
        'surface-container-low': '#edf4ff',
        'inverse-on-surface': '#e8f2ff',
        'on-error': '#ffffff',
        'on-background': '#091d2e',
        'error-container': '#ffdad6',
        'on-tertiary-container': '#64270f',
        'on-surface-variant': '#3e4947',
        'on-secondary-fixed': '#121e1d'
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px'
      },
      spacing: {
        'space-md': '1rem',
        'margin': '1.25rem',
        'gutter': '1rem',
        'space-xs': '0.25rem',
        'space-xl': '2.5rem',
        'space-sm': '0.5rem',
        'space-lg': '1.5rem'
      },
      fontFamily: {
        'body-sm': ['Plus Jakarta Sans'],
        'headline-md': ['Plus Jakarta Sans'],
        'headline-sm': ['Plus Jakarta Sans'],
        'label-md': ['Plus Jakarta Sans'],
        'label-sm': ['Plus Jakarta Sans'],
        'headline-lg': ['Plus Jakarta Sans'],
        'body-md': ['Plus Jakarta Sans'],
        'body-lg': ['Plus Jakarta Sans']
      },
      fontSize: {
        'body-sm': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'headline-sm': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'label-md': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'label-sm': ['12px', { lineHeight: '16px', fontWeight: '500' }],
        'headline-lg': ['32px', { lineHeight: '40px', fontWeight: '700' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }]
      }
    }
  }
};