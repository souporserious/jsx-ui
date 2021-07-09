import pluginTester from 'babel-plugin-tester'
import * as t from '@babel/types'
import template from '@babel/template'
import get from 'dlv'

import plugin from './index'

const breakpoints = {
  small: 600,
  medium: 960,
  large: 1200,
}

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

const native = false

const components = [
  {
    name: 'Text',
    as: native ? 'Text' : 'span',
    source: native ? 'react-native' : null,
    transforms: {
      color: (value, theme) => theme.colors[value],
    },
  },
  {
    name: 'Stack',
    as: native ? 'View' : 'div',
    source: native ? 'react-native' : null,
    defaults: {
      display: 'flex',
    },
    transforms: {
      axis: (value) => ({ flexDirection: value === 'x' ? 'row' : 'column' }),
      width: (value, theme) =>
        value.includes('fr')
          ? { flex: value.slice(0, -2) }
          : get(theme.spacings, value) ?? value,
      spaceX: (value) => ({ paddingLeft: value, paddingRight: value }),
      spaceYStart: (value) => ({ paddingTop: value }),
      spaceYEnd: (value) => ({ paddingBottom: value }),
    },
  },
]

const webVisitor = {
  JSXOpeningElement(path) {
    const id = this.getElementId(path)
    const styleAttributes = this.styleAttributes[id]
    if (styleAttributes) {
      path.node.attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier('css'),
          t.jsxExpressionContainer(t.objectExpression(styleAttributes))
        )
      )
    }
  },
}

const buildStylesheet = template(`
const styles = StyleSheet.create(STYLES)
`)

const nativeVistitor = {
  Program(path) {
    path.pushContainer(
      'body',
      buildStylesheet({
        STYLES: t.objectExpression(
          Object.entries(this.styleAttributes).map(([id, attributes]) =>
            t.objectProperty(t.identifier(id), t.objectExpression(attributes))
          )
        ),
      })
    )
  },
  ImportDeclaration(path) {
    if (path.node.source.value === 'react-native') {
      path.node.specifiers.push(
        t.importSpecifier(
          t.identifier('StyleSheet'),
          t.identifier('StyleSheet')
        )
      )
    }
  },
  JSXOpeningElement(path) {
    const id = this.getElementId(path)
    path.node.attributes.push(
      t.jsxAttribute(
        t.jsxIdentifier('style'),
        t.jsxExpressionContainer(
          t.memberExpression(t.identifier('styles'), t.identifier(id))
        )
      )
    )
  },
}

pluginTester({
  plugin,
  pluginName: '@jsxui/babel-plugin',
  pluginOptions: {
    components,
    theme,
    breakpoints,
    visitor: native ? nativeVistitor : webVisitor,
  },
  filename: __filename,
  snapshot: true,
  tests: [
    { fixture: '__fixtures__/variants.js' },
    // { fixture: '__fixtures__/props.js' },
    // { fixture: '__fixtures__/simple.js' },
    // { fixture: '__fixtures__/variable.js' },
    // { fixture: '__fixtures__/graphic.js' },
  ],
})
