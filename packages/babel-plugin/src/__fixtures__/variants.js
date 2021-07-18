export default function App() {
  return (
    <Stack
      axis="x"
      width="container.medium"
      spaceX={{
        initial: 16,
        'breakpoints.large': 'xlarge',
      }}
      spaceY={40}
      spaceYEnd="80px"
    >
      <Text>Hello World</Text>
    </Stack>
  )
}
