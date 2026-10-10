---
name: Pocket Ledger
colors:
  surface: '#f7f9ff'
  surface-dim: '#c9dcf3'
  surface-bright: '#f7f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#edf4ff'
  surface-container: '#e3efff'
  surface-container-high: '#d9eaff'
  surface-container-highest: '#d1e4fb'
  on-surface: '#091d2e'
  on-surface-variant: '#3e4947'
  inverse-surface: '#203243'
  inverse-on-surface: '#e8f2ff'
  outline: '#6e7977'
  outline-variant: '#bdc9c6'
  surface-tint: '#006a63'
  primary: '#006a63'
  on-primary: '#ffffff'
  primary-container: '#4fb3a9'
  on-primary-container: '#00413c'
  inverse-primary: '#75d7cc'
  secondary: '#55615f'
  on-secondary: '#ffffff'
  secondary-container: '#d8e5e3'
  on-secondary-container: '#5b6765'
  tertiary: '#924a2f'
  on-tertiary: '#ffffff'
  tertiary-container: '#e68d6d'
  on-tertiary-container: '#64270f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#92f3e8'
  primary-fixed-dim: '#75d7cc'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#00504a'
  secondary-fixed: '#d8e5e3'
  secondary-fixed-dim: '#bcc9c7'
  on-secondary-fixed: '#121e1d'
  on-secondary-fixed-variant: '#3d4948'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59b'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#75331a'
  background: '#f7f9ff'
  on-background: '#091d2e'
  surface-variant: '#d1e4fb'
  mint-surface: '#F4FAF9'
  warm-amber: '#F39C12'
  soft-rose: '#E74C3C'
  pure-white: '#FFFFFF'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes a modern, fresh, and therapeutic visual language tailored for personal finance tracking. The aesthetic leans toward a clean, minimalist approach infused with warmth, utilizing generous whitespace, calm typography, and soft chromatic layers to reduce financial anxiety and encourage mindful budgeting.

- **Target Audience:** Individuals seeking a calm, frictionless way to manage daily personal finances without the intimidation of enterprise accounting software.
- **Emotional Response:** Reassurance, clarity, lightness, and control.
- **Design Style:** Modern Minimalist with Soft Tactile Accents.

## Colors

The color palette is anchored by a soothing mint green as the primary driver for positive actions and branding elements. Supporting neutrals are deep and legible, avoiding harsh blacks to maintain a gentle, approachable atmosphere.

- **Primary:** Mint Green (`#4FB3A9`) for primary actions, active states, and positive balance indicators.
- **Secondary:** Pale Teal Tint (`#E8F5F3`) for subtle container backgrounds and hovered states.
- **Neutral:** Deep Slate (`#2C3E50`) for high-contrast, readable typography and structural borders.
- **Semantic Accents:** Warm Amber for pending or warning states; Soft Rose for expenses and deficit indicators.

## Typography

Typography prioritizes geometric clarity with soft, rounded terminals to match the therapeutic branding. Numeric figures must utilize tabular lining for financial data columns to ensure perfect vertical alignment across transaction lists and summaries.

## Layout & Spacing

A fluid grid system optimized for mobile-first usage while gracefully scaling to desktop viewports. On mobile, content stretches to fill screen margins with a standard 20px outer padding (`margin`). On desktop, max-width containers prevent over-stretching of tabular data.

- **Mobile First:** Single-column stacked cards and bottom-anchored navigation.
- **Desktop Adaptation:** Multi-column dashboard layouts featuring side-by-side summary cards and master-detail transaction views.

## Elevation & Depth

Depth is handled via subtle tonal layering and diffused, low-opacity ambient shadows tinted with the primary mint hue. Avoid heavy drop shadows to preserve the lightweight, airy feel of the interface. Use faint, low-contrast outlines for card separators rather than heavy borders.

## Shapes

The shape language relies heavily on friendly, rounded rectangles (`0.5rem` base, `1rem` to `1.5rem` for large containers and floating action buttons). This organic roundedness reinforces the therapeutic, approachable nature of the application, removing harsh 90-degree corners entirely from interactive elements.

## Components

- **Buttons:** Primary buttons feature solid mint green backgrounds with white text and a soft shadow. Secondary buttons use pale teal backgrounds with deep slate text.
- **Chips & Tags:** Category tags (e.g., "Food", "Transport") use pill shapes with light tinted backgrounds and matching icon indicators.
- **Input Fields:** Clean, borderless or softly outlined fields with generous padding, floating labels, and clear numeric keypads on mobile.
- **Cards:** White surfaces resting on a pale mint background, featuring gentle rounded corners and subtle interior padding for balance summaries and transaction groups.
- **Lists & Tables:** Alternating subtle row backgrounds or clean whitespace separators. Financial amounts are right-aligned with strict tabular spacing.