import { Overrides, Text } from '@jsxui/react'

const overrides = [
  <Text color="tomato" variants={{ hover: { color: 'papayawhip' } }} />,
]

function App() {
  return (
    <Overrides value={overrides}>
      <Text>Hello World</Text>
    </Overrides>
  )
}
