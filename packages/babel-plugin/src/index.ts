import { PluginObj, PluginPass } from '@babel/core'
import jsx from '@babel/plugin-syntax-jsx'

import { addSourceProps } from './add-source-props'
import { transformGraphic } from './graphic'

export default function (): PluginObj<PluginPass> {
  let cache
  return {
    name: '@jsxui/babel-plugin',
    inherits: jsx,
    visitor: {
      Program: {
        enter() {
          cache = new Set()
        },
      },
      JSXOpeningElement(path, state) {
        if (path.node.name.name === 'Graphic') {
          transformGraphic(path)
        }
        addSourceProps(path, state, cache)
      },
    },
  }
}
