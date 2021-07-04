import { Stack, Text } from '@jsxui/react'

export default function App() {
  return (
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
    >
      <Text>Hello World</Text>
    </Stack>
  )
}
