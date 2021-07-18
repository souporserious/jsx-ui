import pluginTester from 'babel-plugin-tester'
import * as t from '@babel/types'
import template from '@babel/template'
import get from 'dlv'

import plugin from './index'

const activeVisitor: 'figma' | 'ink' | 'native' | 'web' = 'web'

const theme = {
  breakpoints: {
    small: '@media (min-width: 600px)',
    medium: '@media (min-width: 960px)',
    large: '@media (min-width: 1200px)',
  },
  colors: {
    brand: '#8D6CEE',
    foreground: 'black',
    foregroundSecondary: 'gray',
  },
  fontSizes: {
    small: {
      initial: 10,
      'breakpoints.medium': 12,
    },
    medium: {
      initial: 12,
      'breakpoints.medium': 16,
    },
    large: {
      initial: 20,
      'breakpoints.medium': 28,
    },
    xlarge: {
      initial: 32,
      'breakpoints.medium': 48,
    },
  },
  fontWeights: {
    medium: 400,
    bold: {
      initial: 500,
      'prefers.dark': 600,
    },
  },
  letterSpacings: {
    normal: 0.25,
    tracked: {
      initial: 0.3,
      'prefers.dark': 0.4,
    },
  },
  boxSpacings: {
    xxsmall: '4px',
    xsmall: '8px',
    small: '16px',
    medium: '24px',
    large: '40px',
    xlarge: '60px',
    xxlarge: '80px',
  },
  boxSizes: {
    container: {
      small: '640px',
      medium: '960px',
      large: '1440px',
    },
    button: {},
    input: {},
    icon: {
      small: '20px',
      medium: '32px',
    },
  },
  variants: {
    heading1: {
      initial: {
        size: 'fontSizes.large',
      },
      web: {
        as: 'h1',
      },
      native: {
        as: 'Text',
        accessibilityRole: 'header',
      },
    },
    heading2: {
      initial: {
        size: 'fontSizes.medium',
      },
      web: {
        as: 'h2',
      },
      native: {
        as: 'Text',
        accessibilityRole: 'header',
      },
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
  ink: {
    as: 'Text',
    source: 'ink',
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
  ink: {
    as: 'Box',
    source: 'ink',
    defaults: {
      flexDirection: 'column',
    },
  },
  native: {
    as: 'View',
    source: 'react-native',
  },
  web: {
    as: 'div',
    defaults: {
      display: 'flex',
    },
  },
}

const components = [
  {
    name: 'Text',
    transforms: {
      // size: (value, theme) => ({
      //   fontSize: theme.fontSizes[value],
      // }),
      // weight: (value, theme) => ({
      //   fontWeight: theme.fontWeights[value],
      // }),
      alignment: (value) => ({
        textAlign: value,
      }),
      opacity: (value) => ({
        opacity: value,
      }),
      color: (value) => ({
        color: theme.colors[value],
      }),
    },
    ...textPlatformComponents[activeVisitor],
  },
  {
    name: 'Stack',
    transforms: {
      axis: (value) => ({
        flexDirection: value === 'x' ? 'row' : 'column',
      }),
      width: (value) =>
        value.includes('fr')
          ? { flex: value.slice(0, -2) }
          : getValue(value, 'boxSpacings'),
      spaceX: (value) => ({
        paddingLeft: getValue(value, 'boxSpacings'),
        paddingRight: getValue(value, 'boxSpacings'),
      }),
      spaceXStart: (value) => ({
        paddingLeft: getValue(value, 'boxSpacings'),
      }),
      spaceXEnd: (value) => ({
        paddingRight: getValue(value, 'boxSpacings'),
      }),
      spaceY: (value) => ({
        paddingTop: getValue(value, 'boxSpacings'),
        paddingBottom: getValue(value, 'boxSpacings'),
      }),
      spaceYStart: (value) => ({
        paddingTop: getValue(value, 'boxSpacings'),
      }),
      spaceYEnd: (value) => ({
        paddingBottom: getValue(value, 'boxSpacings'),
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
    const styleProperties = this.styleProperties[id]
    if (styleProperties) {
      path.node.attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier('css'),
          t.jsxExpressionContainer(t.objectExpression(styleProperties))
        )
      )
    }
  },
}

const figmaVisitor = {
  JSXOpeningElement(path) {
    const id = this.getElementId(path)
    const styleProperties = this.styleProperties[id]
    if (styleProperties) {
      path.node.attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier('style'),
          t.jsxExpressionContainer(t.objectExpression(styleProperties))
        )
      )
    }
  },
}

const inkVisitor = {
  JSXOpeningElement(path) {
    const id = this.getElementId(path)
    const styleAttributes = this.styleAttributes[id]
    if (styleAttributes) {
      path.node.attributes = path.node.attributes.concat(styleAttributes)
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
          Object.entries(this.styleProperties).map(([id, styleProperties]) =>
            t.objectProperty(
              t.identifier(id),
              t.objectExpression(styleProperties)
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
  ink: inkVisitor,
  native: nativeVisitor,
  web: webVisitor,
}

pluginTester({
  plugin,
  pluginName: '@jsxui/babel-plugin',
  pluginOptions: {
    components,
    theme,
    visitor: visitors[activeVisitor],
  },
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
