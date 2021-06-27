import * as React from 'react'

export default function Stateful() {
  const [count, setCount] = React.useState(0)
  return (
    <div>
      {count}
      <button onClick={() => setCount(count + 1)}>Increase</button>
    </div>
  )
}
