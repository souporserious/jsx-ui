import pluginTester from 'babel-plugin-tester'

import plugin from './index'

const theme = {
  colors: {
    primary: 'purple',
    secondary: 'grey',
  },
  spacings: {
    xxsmall: '4px',
    xsmall: '8px',
    small: '16px',
    medium: '24px',
    large: '40px',
    xlarge: '60px',
    xxlarge: '80px',
    container: {
      small: '640px',
      medium: '960px',
      large: '1440px',
    },
    icon: {
      small: '20px',
      medium: '32px',
    },
  },
}

pluginTester({
  plugin,
  pluginName: '@jsxui/babel-plugin',
  pluginOptions: {
    theme,
  },
  filename: __filename,
  snapshot: true,
  tests: [
    { fixture: '__fixtures__/props.js' },
    // { fixture: '__fixtures__/simple.js' },
    // { fixture: '__fixtures__/variable.js' },
    // { fixture: '__fixtures__/graphic.js' },
  ],
})
