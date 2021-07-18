import React from 'react'
import { Text, Tokens, Spacer, Stack } from '@jsxui/react'

import { Github, Logo, Shapes, Wave } from '../assets'

export default function Index() {
  return (
    <Tokens
      colors={{
        brand: '#8D6CEE',
        foreground: 'black',
        foregroundSecondary: 'gray',
      }}
      fontSizes={{
        xlarge: 32,
        large: 20,
        medium: 12,
      }}
      variants={{
        'breakpoints.medium': {
          fontSizes: {
            xlarge: 48,
            large: 28,
            medium: 16,
          },
        },
      }}
    >
      <Stack height="minmax(100vh, auto)">
        <div style={{ display: 'grid' }}>
          <Stack style={{ gridArea: '1 / 1' }}>
            <Shapes
              visible={false}
              width="100%"
              variants={{ 'breakpoints.large': { visible: true } }}
            />
          </Stack>
          <Stack
            axis="x"
            spaceX="minmax(16px, 1fr)"
            style={{ gridArea: '1 / 1' }}
          >
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
                variants={{
                  'breakpoints.medium': {
                    size: '80px',
                  },
                }}
              />
              <Text
                width="1fr"
                size="xlarge"
                weight="900"
                lineSpacing={24}
                alignment="center"
                spaceBefore={0}
                spaceAfter={0}
                variants={{
                  'breakpoints.medium': {
                    spaceBefore: 60,
                    spaceAfter: 60,
                  },
                }}
              >
                Simple UI Primitives to Help Launch Your next&nbsp;Idea
              </Text>
              <Spacer
                size="32px"
                variants={{
                  'breakpoints.medium': {
                    size: '48px',
                  },
                }}
              />
            </Stack>
          </Stack>
        </div>
        <Stack
          axis="x"
          width="minmax(100%, 1440px)"
          spaceYStart="40px"
          spaceYEnd="80px"
          variants={{
            xray: {
              background: 'url(#diagonalHatch)',
            },
            'breakpoints.large': {
              spaceX: '1fr',
              spaceBetween: 'minmax(24px, 0.5fr)',
            },
          }}
          // TODO: add X/YWrap components
          style={{ flexWrap: 'wrap' }}
        >
          {['Elements', 'Variants', 'Overrides', 'Editor'].map((name) => (
            <Stack
              key={name}
              width="50%"
              spaceX="1fr"
              spaceBetween="24px"
              variants={{
                'breakpoints.large': {
                  width: '1fr',
                },
              }}
            >
              <Text size="large" weight={600} alignment="center" opacity={0.75}>
                {name}
              </Text>
              <Text>Coming Soon</Text>
            </Stack>
          ))}
        </Stack>
        <Wave width="1fr" height="auto" />
        <Spacer size="minmax(80px, 1fr)" background="#7B5AD9" />
      </Stack>
    </Tokens>
  )
}
