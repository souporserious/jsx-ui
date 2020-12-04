import React from 'react'
import { Text, Tokens, Spacer, Stack } from '@jsxui/react'

import { Github, Logo, Wave } from '../assets'

export default function Index() {
  return (
    <Tokens
      colors={{
        brand: '#8D6CEE',
        foreground: 'black',
        foregroundSecondary: 'gray',
      }}
      fontSizes={{
        xlarge: 40,
        large: 20,
        medium: 12,
      }}
      variants={{
        'breakpoints.medium': {
          fontSizes: {
            xlarge: 64,
            large: 28,
            medium: 16,
          },
        },
      }}
    >
      <Stack height="minmax(100vh, auto)">
        <Stack axis="x" spaceX="minmax(16px, 1fr)">
          <Stack
            width="minmax(auto, 960px)"
            spaceX="1fr"
            spaceYStart="16px"
            spaceYEnd="minmax(16px, 1fr)"
          >
            <Stack
              axis="x"
              width="1fr"
              spaceY="1fr"
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
  )
}
