import * as React from 'react'
import { Page } from 'react-figma'

export const App = () => {
  return (
    <Page name="Buttons">
      <stack spaceX={16} spaceY={64} background="primary">
        <text color="primary">Hello World</text>
      </stack>
    </Page>
  )
}
