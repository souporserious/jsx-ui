import React, { useState, useEffect } from 'react'
import { render } from 'ink'

const Counter = () => {
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((previousCounter) => previousCounter + 1)
    }, 100)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <Stack spaceX={8} spaceY={16}>
      <Text color="primary">{counter} tests passed</Text>
    </Stack>
  )
}

render(<Counter />)
