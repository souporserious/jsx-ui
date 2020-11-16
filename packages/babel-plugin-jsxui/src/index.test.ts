import pluginTester from 'babel-plugin-tester/pure'

import plugin from '../src'

pluginTester({
  plugin,
  pluginName: 'babel-plugin-jsxui',
  filename: __filename,
  snapshot: true,
  tests: [{ fixture: '__fixtures__/simple.js' }],
})
