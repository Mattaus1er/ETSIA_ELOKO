---
name: ELOKO Dark Intelligence
colors:
  surface: '#111318'
  surface-dim: '#111318'
  surface-bright: '#37393e'
  surface-container-lowest: '#0c0e12'
  surface-container-low: '#1a1c20'
  surface-container: '#1e2024'
  surface-container-high: '#282a2e'
  surface-container-highest: '#333539'
  on-surface: '#e2e2e8'
  on-surface-variant: '#d0c5b2'
  inverse-surface: '#e2e2e8'
  inverse-on-surface: '#2e3035'
  outline: '#99907e'
  outline-variant: '#4d4637'
  surface-tint: '#e6c364'
  primary: '#e6c364'
  on-primary: '#3d2e00'
  primary-container: '#c9a84c'
  on-primary-container: '#503d00'
  inverse-primary: '#755b00'
  secondary: '#43ed9e'
  on-secondary: '#003920'
  secondary-container: '#00d084'
  on-secondary-container: '#005231'
  tertiary: '#ffb3b9'
  on-tertiary: '#67001e'
  tertiary-container: '#ff8895'
  on-tertiary-container: '#840028'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe08f'
  primary-fixed-dim: '#e6c364'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#584400'
  secondary-fixed: '#59fead'
  secondary-fixed-dim: '#31e193'
  on-secondary-fixed: '#002111'
  on-secondary-fixed-variant: '#005231'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b8'
  on-tertiary-fixed: '#40000f'
  on-tertiary-fixed-variant: '#91002d'
  background: '#111318'
  on-background: '#e2e2e8'
  surface-variant: '#333539'
typography:
  display-data:
    fontFamily: IBM Plex Mono
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-panel:
    fontFamily: manrope
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.01em
  body-ui:
    fontFamily: manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  data-mono:
    fontFamily: IBM Plex Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: '0'
  label-caps:
    fontFamily: manrope
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 1px
---

## Brand & Style
This design system establishes an institutional-grade visual language for African financial intelligence. The brand personality is one of "Dark Intelligence"—combining the high-density utility of professional trading platforms with a modern Neo-Brutalist edge. It targets sophisticated investors and institutions who require precision and speed.

The style is defined by structural integrity, utilizing a strict 4px grid and high-contrast outlines to define space rather than shadows. The aesthetic is raw yet refined, conveying a sense of absolute reliability and high-tech sophistication. The interface does not hide complexity; it organizes it through rigid geometry and clear information hierarchy.

## Colors
The palette is engineered for prolonged high-concentration use. The foundation is a permanent "Midnight" dark mode (#080A0E), which minimizes eye strain and allows data to take center stage. 

- **Primary (Gold):** Used exclusively for high-level brand moments, primary actions, and institutional indicators.
- **Sentiment (Bull/Bear):** Green (#00D084) and Red (#FF4D6D) are calibrated for high legibility against dark backgrounds, used strictly for market direction and performance.
- **Layering:** Panels and cards use subtle shifts in value (#0F1117 and #141820) to create structural depth without the need for light-source effects.

## Typography
The typographic strategy utilizes a dual-font approach to separate narrative from data. 

- **UI Text:** Manrope (mapping to the spirit of DM Sans) provides a clean, modern, and highly legible sans-serif for interface labels, menus, and descriptive text.
- **Numerical Data:** IBM Plex Mono is the workhorse for all financial figures, ticker symbols, and timestamps. Its fixed-width nature ensures that numbers align perfectly in tables and dashboards, facilitating rapid scanning and comparison.
- **Hierarchy:** Use uppercase labels for metadata headers to reinforce the institutional, "terminal" aesthetic.

## Layout & Spacing
The design system employs a strict 4px grid. All dimensions, padding, and margins must be multiples of 4. The layout philosophy is a **Fluid Grid** modeled after professional trading terminals (TradingView style), where workspace panels can be resized but remain anchored to the grid.

A signature element is the "Gutter" — a 1px border (#2D323E) that acts as the primary separator between all panels and UI blocks. Avoid excessive whitespace; the goal is high information density handled through clean, mathematical organization.

## Elevation & Depth
In this design system, depth is communicated through **Bold Borders** and **Tonal Layering** rather than shadows. 

1. **Base Level:** The application background (#080A0E).
2. **Panel Level:** Large layout containers (#0F1117) with a 1px border.
3. **Component Level:** Interactive cards or popovers (#141820) with a slightly lighter 1px border to indicate "lift."

Shadows are strictly prohibited. Visual hierarchy is achieved by contrast and container color. Active states for components should use the Gold accent or a subtle fill change rather than a glow or shadow.

## Shapes
The shape language is "Soft-Brutalist." While the layout is rigid and grid-based, elements possess a 5-10px border radius to ensure the interface feels modern and premium rather than archaic.

- **Standard Elements:** 6px radius (Inputs, Buttons, Cards).
- **Small Elements:** 4px radius (Tags, Chips).
- **Layout Panels:** 8px radius for outer containers to frame the workspace.

## Components
- **Buttons:** Primary buttons use a solid Gold (#C9A84C) fill with black text. Secondary buttons are ghost-style with a 1px border. All have 0px elevation.
- **Input Fields:** Darker than their container background with a 1px border that shifts to Gold on focus. Use IBM Plex Mono for input text.
- **Data Tables:** Zebra striping is discouraged. Use 1px horizontal dividers. Values should be monospaced and right-aligned.
- **Chips/Badges:** Small, rectangular with 4px radius. Use Bullish Green or Bearish Red fills at 15% opacity with solid text for sentiment indicators.
- **Charts:** TradingView integration style. Grid lines should be minimal and match the border color (#2D323E).
- **Tickers:** Continuous horizontal scroll or static lists using IBM Plex Mono, ensuring high contrast for price movements.