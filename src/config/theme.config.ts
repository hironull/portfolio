export const themeConfig = {
  // Color Scheme
  colors: {
    primary: '#11111b',      // Main dark color
    secondary: '#cba6f7',    // Purple accent
    background: '#cba6f7',   // Light purple background
    foreground: '#11111b',   // Dark text
    muted: '#a991d4',        // Muted purple
    accent: '#cba6f7',       // Accent purple
  },
  
  // Typography
  fonts: {
    mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
    code: ['Fira Code', 'JetBrains Mono', 'Courier New', 'monospace'],
  },
  
  // Animation Settings
  animations: {
    speed: {
      fast: '0.2s',
      normal: '0.3s',
      slow: '0.6s',
    },
    easing: {
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
  },
  
  // Effects
  effects: {
    glowEnabled: true,
    particlesEnabled: true,
    scrollProgressEnabled: true,
    typingAnimationEnabled: true,
    floatAnimationEnabled: true,
  },
  
  // Layout
  layout: {
    maxWidth: '1280px',
    containerPadding: '2rem',
    borderRadius: '0.75rem',
  },
} as const;

export type ThemeConfig = typeof themeConfig;