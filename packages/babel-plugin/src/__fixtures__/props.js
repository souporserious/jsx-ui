export default function App() {
  const x = 'x'
  return (
    <Stack
      axis={x}
      width="minmax(100%, 1440px)"
      spaceYStart="40px"
      spaceYEnd={80}
    >
      <Text color="primary">Hello</Text>
      <Text color="secondary">World</Text>
    </Stack>
  )
}
