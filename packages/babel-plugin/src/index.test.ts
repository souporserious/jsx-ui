import pluginTester from 'babel-plugin-tester'
import * as t from '@babel/types'
import template from '@babel/template'
import get from 'dlv'

import plugin from './index'

const activeVisitor: 'figma' | 'native' | 'web' = 'figma'

const breakpoints = {
  small: '@media (min-width: 600px)',
  medium: '@media (min-width: 960px)',
  large: '@media (min-width: 1200px)',
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

const getValue = (value, key) => {
  return typeof value === 'number' ? value : get(theme[key], value, value)
}

const textPlatformComponents = {
  figma: {
    as: 'Text',
    source: 'react-figma',
  },
  native: {
    as: 'Text',
    source: 'react-native',
  },
  web: {
    as: 'span',
  },
}

const stackPlatformComponents = {
  figma: {
    as: 'View',
    source: 'react-figma',
  },
  native: {
    as: 'View',
    source: 'react-native',
  },
  web: {
    as: 'div',
  },
}

const components = [
  {
    name: 'Text',
    transforms: {
      color: (value) => ({
        color: theme.colors[value],
      }),
    },
    ...textPlatformComponents[activeVisitor],
  },
  {
    name: 'stack',
    defaults: {
      display: 'flex',
    },
    transforms: {
      axis: (value) => ({
        flexDirection: value === 'x' ? 'row' : 'column',
      }),
      width: (value) =>
        value.includes('fr')
          ? { flex: value.slice(0, -2) }
          : getValue(value, 'spacings'),
      spaceX: (value) => ({
        paddingLeft: getValue(value, 'spacings'),
        paddingRight: getValue(value, 'spacings'),
      }),
      spaceXStart: (value) => ({
        paddingLeft: getValue(value, 'spacings'),
      }),
      spaceXEnd: (value) => ({
        paddingRight: getValue(value, 'spacings'),
      }),
      spaceY: (value) => ({
        paddingTop: getValue(value, 'spacings'),
        paddingBottom: getValue(value, 'spacings'),
      }),
      spaceYStart: (value) => ({
        paddingTop: getValue(value, 'spacings'),
      }),
      spaceYEnd: (value) => ({
        paddingBottom: getValue(value, 'spacings'),
      }),
      background: (value) => ({
        background: theme.colors[value],
      }),
    },
    ...stackPlatformComponents[activeVisitor],
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

const figmaVisitor = {
  JSXOpeningElement(path) {
    const id = this.getElementId(path)
    const styleAttributes = this.styleAttributes[id]
    if (styleAttributes) {
      path.node.attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier('style'),
          t.jsxExpressionContainer(t.objectExpression(styleAttributes))
        )
      )
    }
  },
}

const buildStylesheet = template(`
const styles = StyleSheet.create(STYLES)
`)

const nativeVisitor = {
  Program(path) {
    path.pushContainer(
      'body',
      buildStylesheet({
        STYLES: t.objectExpression(
          Object.entries(this.styleAttributes).map(([id, styleAttributes]) =>
            t.objectProperty(
              t.identifier(id),
              t.objectExpression(styleAttributes)
            )
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

const visitors = {
  figma: figmaVisitor,
  native: nativeVisitor,
  web: webVisitor,
}

pluginTester({
  plugin,
  pluginName: '@jsxui/babel-plugin',
  pluginOptions: {
    components,
    theme,
    breakpoints,
    visitor: visitors[activeVisitor],
  },
  filename: __filename,
  snapshot: true,
  tests: [
    { fixture: '__fixtures__/react-figma.js' },
    // { fixture: '__fixtures__/variants.js' },
    // { fixture: '__fixtures__/props.js' },
    // { fixture: '__fixtures__/simple.js' },
    // { fixture: '__fixtures__/variable.js' },
    // { fixture: '__fixtures__/graphic.js' },
  ],
})
