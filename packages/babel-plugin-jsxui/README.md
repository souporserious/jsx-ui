# babel-plugin-jsxui

A compiler for writing maintainable, performant, and design friendly JSX.

OR

Add helpful meta information to your JSX. Callbacks available for static analysis.

## Configuring plugin

```json
{
  "plugins": [["babel-plugin-jsxui", { "target": "web" }]]
}
```

## Interpreter

This will build `Text` and `Stack` components as HTML elements for web:

```jsx
export default function App() {
  return <span>Hello World</span>
}
```

Alternatively, you can build additional targets like `native`:

```json
{
  "plugins": [["babel-plugin-jsxui", { "target": "native" }]]
}
```

```jsx
import { View } from 'react-native'

export default function App() {
  return <View>Hello World</View>
}
```

You can even configure the styling solution you want:

.babelrc

```json
{
  "plugins": [
    [
      "babel-plugin-jsxui",
      {
        "target": "web",
        "style": "emotion"
      }
    ]
  ]
}
```

.jsxuirc

```js
export default {
  colors: {
    primary: 'hotpink',
    secondary: 'black',
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    bold: 700,
  },
}
```

### In

```jsx
import { Text } from '@jsxui/react'

export default function App() {
  return (
    <Text weight="light" color="primary">
      Hello World
    </Text>
  )
}
```

### Out

Emotion / Styled Components

```jsx
export default function App() {
  return (
    <span
      css={{
        fontWeight: 'var(--weights-light)',
        color: 'var(--colors-primary)',
      }}
    >
      Hello World
    </span>
  )
}
```

Tailwind

```jsx
export default function App() {
  return <span className="font-light text-primary">Hello World</span>
}
```
