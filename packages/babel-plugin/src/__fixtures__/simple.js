import { Overrides } from '@jsxui/react'

export default function App() {
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
