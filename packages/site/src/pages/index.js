import React from 'react'
import { Text, Tokens, Spacer, Stack, Variants } from '@jsxui/react'

import { Github, Logo, Wave } from '../assets'

function useMatches(queries) {
  const [matches, setMatches] = React.useState({})
  React.useLayoutEffect(() => {
    const updateMatches = () => {
      setMatches(
        Object.keys(queryLists).reduce((matches, key) => {
          const queryList = queryLists[key]
          return { ...matches, [key]: queryList.matches }
        }, {})
      )
    }
    const queryLists = Object.keys(queries).reduce((queryLists, key) => {
      const queryList = window.matchMedia(queries[key])
      queryList.addListener(updateMatches)
      queryLists[key] = queryList
      return queryLists
    }, {})
    updateMatches()
    return () => {
      Object.keys(queryLists).forEach((key) =>
        queryLists[key].removeListener(updateMatches)
      )
    }
  }, [])
  return matches
}

export default function Index() {
  const [xray, setXray] = React.useState(false)
  const matches = useMatches({
    'breakpoints.small': '(min-width: 0px)',
    'breakpoints.medium': '(min-width: 768px)',
    'breakpoints.large': '(min-width: 1280px)',
  })
  React.useEffect(() => {
    document.addEventListener('click', () => {
      setXray((bool) => !bool)
    })
  }, [])
  return (
    <Variants value={{ xray, ...matches }}>
      <Tokens
        value={{
          colors: {
            brand: '#8D6CEE',
            foreground: 'black',
            foregroundSecondary: 'gray',
          },
          fontSizes: {
            xlarge: 40,
            large: 20,
            medium: 12,
          },
        }}
        variants={{
          'breakpoints.medium': {
            value: {
              colors: {
                brand: '#8D6CEE',
                foreground: 'black',
                foregroundSecondary: 'gray',
              },
              fontSizes: {
                xlarge: 64,
                large: 28,
                medium: 16,
              },
            },
          },
        }}
      >
        <Stack height="minmax(100vh, auto)">
          <Stack axis="horizontal" spaceMain="minmax(16px, 1fr)">
            <Stack
              width="minmax(auto, 960px)"
              spaceMainStart="16px"
              spaceMainEnd="minmax(16px, 1fr)"
              spaceCross="1fr"
            >
              <Stack
                axis="horizontal"
                width="1fr"
                spaceCross="1fr"
                spaceBefore={0}
                spaceAfter={0}
              >
                <Logo width="auto" height="32px" />
                <Spacer />
                <Stack as="a" href="https://github.com/souporserious/jsxui">
                  <Github />
                </Stack>
              </Stack>
              <Spacer
                size="80px"
                variants={{ 'breakpoints.medium': { size: '80px' } }}
              />
              <Text
                width="1fr"
                spaceBefore={0}
                spaceAfter={0}
                size="xlarge"
                weight="900"
                lineSpacing={24}
                alignment="center"
              >
                UI Elements Evolved
              </Text>
              <Spacer
                size="40px"
                variants={{ 'breakpoints.medium': { size: '64px' } }}
              />
              <Text
                width="minmax(auto, 735px)"
                size="large"
                weight="700"
                lineSpacing={20}
                alignment="center"
                color="foregroundSecondary"
              >
                Simple and powerful primitives to help launch your next idea.
              </Text>
              <Spacer
                size="32px"
                variants={{ 'breakpoints.medium': { size: '48px' } }}
              />
              <Stack space="16px" background="brand" radius={5}>
                <Text weight="700" color="white">
                  Coming Soon
                </Text>
              </Stack>
            </Stack>
          </Stack>
          <Wave width="1fr" height="auto" />
          <Spacer
            background="#7B5AD9"
            variants={{
              xray: {
                background: 'url(#diagonalHatch)',
              },
            }}
          />
        </Stack>
      </Tokens>
    </Variants>
  )
}
