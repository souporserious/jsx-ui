import pluginTester from 'babel-plugin-tester/pure'

import plugin from './index'

pluginTester({
  plugin,
  pluginName: '@jsxui/babel-plugin',
  filename: __filename,
  snapshot: true,
  tests: [
    { fixture: '__fixtures__/simple.js' },
    { fixture: '__fixtures__/variable.js' },
    { fixture: '__fixtures__/graphic.js' },
  ],
})
