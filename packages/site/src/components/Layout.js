import React from 'react'
import { globalHistory } from '@reach/router'
import { Modifiers, Text, Tokens, Stack } from 'jsx-ui'

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
    background: '#083cb6',
    foreground: 'white',
  },
}

const overrides = [
  [
    Text,
    {
      family: 'body',
      size: 'medium',
      weight: 'light',
      color: 'white',
    },
  ],
]

const duration = 0.25

const variants = {
  initial: (direction) => ({
    scale: direction === 1 ? 0.9 : 1.1,
    opacity: 0,
  }),
  enter: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: duration,
      delay: duration,
      when: 'beforeChildren',
    },
  },
  exit: (direction) => ({
    scale: direction === 1 ? 1.1 : 0.9,
    opacity: 0,
    transition: { duration: duration },
  }),
}

function getPathnameLevel(pathname) {
  const pathnameChars = pathname.split('')
  return pathnameChars.length <= 1
    ? 0
    : pathnameChars.reduce(
        (count, char) => (char === '/' ? count + 1 : count),
        0
      )
}

function Layout({ children, location }) {
  const [direction, setDirection] = React.useState(1)
  const previousPathname = React.useRef(null)
  React.useLayoutEffect(() => {
    document.body.style.margin = 0
    document.body.style.background =
      'linear-gradient(-180deg, rgb(8, 60, 182), rgb(14, 30, 69))'

    previousPathname.current = location.pathname
    return globalHistory.listen((event) => {
      if (event.action === 'POP') {
        const currentLevel = getPathnameLevel(event.location.pathname)
        const previousLevel = getPathnameLevel(previousPathname.current)
        setDirection(currentLevel < previousLevel ? -1 : 1)
      }
      previousPathname.current = event.location.pathname
    })
  }, [])
  return (
    <Tokens value={tokens}>
      <Modifiers value={overrides}>
        <Stack>
          {children}
          {/* <Stack visible="gridOverlay">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(() => (
              <Stack background="orange" />
            ))}
          </Stack> */}
        </Stack>
      </Modifiers>
    </Tokens>
  )
}

export default Layout
