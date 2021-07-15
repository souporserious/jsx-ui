export default function App() {
  return (
    <Stack
      axis="x"
      width="container.medium"
      spaceX={{
        initial: 16,
        'breakpoints.large': 'xlarge',
      }}
      spaceYStart="40px"
      spaceYEnd="80px"
    >
      <Text>Hello World</Text>
    </Stack>
  )
}
