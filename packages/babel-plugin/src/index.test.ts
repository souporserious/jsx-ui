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

const components = [
  {
    name: 'Text',
    as: 'span',
    props: {
      color: ['primary', 'secondary'],
    },
    transforms: {
      color: (value, theme) => theme.colors[value],
    },
  },
  {
    name: 'Stack',
    as: 'div',
    props: {
      axis: ['x', 'y'],
      width: null,
      spaceYStart: null,
      spaceYEnd: null,
    },
    defaults: {
      display: 'flex',
    },
    transforms: {
      axis: (value) => ['flexDirection', value === 'x' ? 'row' : 'column'],
      width: (value, theme) => theme.spacings[value] ?? value,
      spaceYStart: (value) => ['paddingTop', value],
      spaceYEnd: (value) => ['paddingBottom', value],
    },
  },
]

pluginTester({
  plugin,
  pluginName: '@jsxui/babel-plugin',
  pluginOptions: {
    components,
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
