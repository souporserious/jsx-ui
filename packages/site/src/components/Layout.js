import React from 'react'
import { DevTools, Overrides, override, Text, Tokens, Stack } from 'jsx-ui'

import './layout.css'

const tokens = {
  fontFamilies: {
    body: 'Muli',
  },
  fontMetrics: {
    body: {
      capHeight: 712,
      ascent: 1005,
      descent: -250,
      lineGap: 0,
      unitsPerEm: 1000,
    },
  },
  fontSizes: {
    xsmall: 12,
    small: 14,
    medium: 16,
    large: 22,
    xlarge: 32,
  },
  fontWeights: {
    light: '300',
    medium: '400',
    bold: '700',
  },
  lineSpacings: {
    small: '4px',
    medium: '12px',
    large: '24px',
  },
  stackSpacings: {
    small: '8px',
    medium: '16px',
    large: '32px',
  },
  colors: {
    foreground: '#000',
  },
}

const playstationTokens = {
  fontFamilies: {
    body: 'Muli',
  },
  fontMetrics: {
    body: {
      capHeight: 712,
      ascent: 1005,
      descent: -250,
      lineGap: 0,
      unitsPerEm: 1000,
    },
  },
  fontSizes: {
    xsmall: 12,
    small: 14,
    medium: 16,
    large: 22,
    xlarge: 32,
  },
  fontWeights: {
    light: '300',
    medium: '400',
    bold: '700',
  },
  colors: {
    background: '#083cb6',
    foreground: 'white',
  },
}

const overrides = [
  override(Text, {
    family: 'body',
    size: 'medium',
    weight: 'light',
    color: 'foreground',
  }),
]

function Layout({ children, location }) {
  if (location.pathname.includes('playstation')) {
    return (
      <DevTools>
        <Tokens value={playstationTokens}>
          <Overrides value={overrides}>
            <Stack
              width="100%"
              height="minmax(100vh, 1fr)"
              background="linear-gradient(-180deg, rgb(8, 60, 182), rgb(14, 30, 69))"
            >
              {children}
            </Stack>
          </Overrides>
        </Tokens>
      </DevTools>
    )
  }

  return (
    <DevTools>
      <Tokens value={tokens}>
        <Overrides value={overrides}>{children}</Overrides>
      </Tokens>
    </DevTools>
  )
}

export default Layout
