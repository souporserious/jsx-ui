import { Stack, Text } from '@jsxui/react'

export default function App() {
  return (
    <Stack
      axis="x"
      width="minmax(100%, 1440px)"
      spaceYStart="40px"
      spaceYEnd="80px"
    >
      <Text color="primary">Hello World</Text>
    </Stack>
  )
}
