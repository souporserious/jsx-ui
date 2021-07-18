import pluginTester from 'babel-plugin-tester'

import plugin from './index'
import { createConfig } from './config'

pluginTester({
  plugin,
  pluginName: '@jsxui/babel-plugin',
  pluginOptions: createConfig('web'),
  filename: __filename,
  snapshot: true,
  tests: [
    { fixture: '__fixtures__/site.js' },
    // { fixture: '__fixtures__/visibility.js' },
    // { fixture: '__fixtures__/ink.js' },
    // { fixture: '__fixtures__/multiple-props.js' },
    // { fixture: '__fixtures__/empty.js' },
    // { fixture: '__fixtures__/react-figma.js' },
    // { fixture: '__fixtures__/variants.js' },
    // { fixture: '__fixtures__/props.js' },
    // { fixture: '__fixtures__/simple.js' },
    // { fixture: '__fixtures__/variable.js' },
    // { fixture: '__fixtures__/graphic.js' },
  ],
})
