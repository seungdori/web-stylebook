// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Web Stylebook

/**
 * How a host selects the Quiet Utility palette.
 * The color values live in theme.css. This module is the selector contract
 * the site shell can reuse without parsing the stylesheet.
 */
export const kitThemeContract = {
  stylesheet: 'theme.css',
  light: {
    selectors: [':root', '.light', '[data-theme="light"]'],
  },
  dark: {
    media: '(prefers-color-scheme: dark)',
    selectors: ['.dark', '[data-theme="dark"]'],
  },
} as const;
