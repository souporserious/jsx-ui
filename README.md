## ⚠️ Currently under development, not ready for use yet

This library is currently unstable and the API is in flux. It is being worked on in the open for better exposure, please feel free to file an issue if you have any questions or suggestions. As of right now, packages aren't published yet and documentation may be lacking or stale.

<p align="center">
  <img src="images/logo.png?raw=true" width="400" height="145" alt="JSXUI" />
</p>

<h3 align="center">
  Prototype & Ship Ideas Faster
</h3>

<p align="center">
  JSXUI is a set of primitive elements and concepts to help build cross-platform user interfaces in React.
</p>

## Example

```jsx
import React from 'react'
import { Tokens, Overrides, Stack, Text } from '@jsxui/react'

const tokens = {
  fontFamilies: {
    body: 'Muli',
  },
  fontSizes: {
    xsmall: 12,
    small: 14,
    medium: 16,
    large: 22,
    xlarge: 32,
  },
  fontWeights: {
    light: '300',
    medium: '400',
    bold: '700',
  },
  colors: {
    background: '#083cb6',
    foreground: 'white',
  },
}

const overrides = [
  [
    Text,
    {
      family: 'body',
      size: 'medium',
      weight: 'light',
      color: 'foreground',
    },
  ],
]

export default () => {
  return (
    <Tokens value={tokens}>
      <Overrides value={overrides}>
        <Stack space="1fr">
          <Text size="large">JSX UI</Text>
        </Stack>
      </Overrides>
    </Tokens>
  )
}
```
