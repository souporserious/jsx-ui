import { Overrides, Text } from '@jsxui/react'

function App() {
  return (
    <Overrides
      value={[
        <Text color="tomato" variants={{ hover: { color: 'papayawhip' } }} />,
      ]}
    >
      <Text>Hello World</Text>
    </Overrides>
  )
}
