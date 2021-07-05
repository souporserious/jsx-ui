import { NodePath, PluginObj, PluginPass } from '@babel/core'
import * as t from '@babel/types'
import jsx from '@babel/plugin-syntax-jsx'

import { transformGraphic } from './graphic'

// adapted from: https://github.com/babel/babel/blob/master/packages/babel-plugin-transform-react-jsx-source/
const TRACE_ID = '__jsxuiSource'
const FILE_NAME_ID = '__jsxuiFileName'

function makeTrace(fileNameIdentifier, lineNumber, columnBased) {
  const fileNameProperty = t.objectProperty(
    t.identifier('fileName'),
    fileNameIdentifier
  )
  const lineNumberProperty = t.objectProperty(
    t.identifier('lineNumber'),
    lineNumber != null ? t.numericLiteral(lineNumber) : t.nullLiteral()
  )
  const columnNumberProperty = t.objectProperty(
    t.identifier('columnNumber'),
    columnBased != null ? t.numericLiteral(columnBased + 1) : t.nullLiteral()
  )
  return t.objectExpression([
    fileNameProperty,
    lineNumberProperty,
    columnNumberProperty,
  ])
}

// adapted from: https://github.com/babel/babel/blob/main/packages/babel-helper-builder-react-jsx/src/index.js
function convertAttributeValue(node) {
  if (t.isJSXExpressionContainer(node)) {
    return node.expression
  } else {
    return node
  }
}

function convertAttribute(node) {
  const value = convertAttributeValue(node.value || t.booleanLiteral(true))

  if (t.isJSXSpreadAttribute(node)) {
    return t.spreadElement(node.argument)
  }

  if (t.isStringLiteral(value) && !t.isJSXExpressionContainer(node.value)) {
    value.value = value.value.replace(/\n\s+/g, ' ')

    // "raw" JSXText should not be used from a StringLiteral because it needs to be escaped.
    delete value.extra?.raw
  }

  if (t.isJSXNamespacedName(node.name)) {
    node.name = t.stringLiteral(
      node.name.namespace.name + ':' + node.name.name.name
    )
  } else if (t.isValidIdentifier(node.name.name)) {
    node.name.type = 'Identifier'
  } else {
    node.name = t.stringLiteral(node.name.name)
  }

  return t.inherits(t.objectProperty(node.name, value), node)
}

type PluginOptions = {
  opts: {
    components: {
      /** The name of the component. */
      name: string

      /** What element should this component render as. */
      as: string

      /** What library should this component be imported from. */
      import?: string

      /** What default styles should be applied before merging style props. */
      defaults?: any

      /** Style props to process. */
      props?: any

      /** Transforms to be ran for specific props. */
      transforms?: any
    }[]
    theme: any
  }
} & PluginPass

export default function (): PluginObj<PluginOptions> {
  const cache = new Set()
  const importDeclarations = new Map()
  return {
    name: '@jsxui/babel-plugin',
    inherits: jsx,
    visitor: {
      Program: {
        exit(path, state) {
          if (importDeclarations.size > 0) {
            console.log(importDeclarations.entries())
            // Determine if import exists
            // path.travers({
            //   ImportDeclaration(path, state): {
            //     //
            //   }
            // })
            // Add import if it didn't exist
            // this.importDeclarations.forEach(declaration => )
          }
        },
      },
      JSXElement(path, state) {
        const { components, theme } = state.opts

        components.forEach((component) => {
          if (path.node.openingElement.name.name === component.name) {
            path.node.openingElement.name.name = component.as
            path.node.closingElement.name.name = component.as

            const attributes = []
            const styleAttributes = []
            const defaultAttributes = []

            if (component.import) {
              importDeclarations.set(component.import, component.name)
            }

            if (component.defaults) {
              Object.entries(component.defaults).forEach(([key, value]) => {
                defaultAttributes.push(
                  t.objectProperty(
                    t.identifier(key),
                    typeof value === 'boolean'
                      ? t.booleanLiteral(value)
                      : typeof value === 'number'
                      ? t.numericLiteral(value)
                      : typeof value === 'string'
                      ? t.stringLiteral(value)
                      : null
                  )
                )
              })
            }

            path.node.openingElement.attributes.forEach((attribute) => {
              const styleProp = component.props[attribute.name.name]
              if (styleProp !== undefined) {
                const transform = component.transforms[attribute.name.name]
                if (transform) {
                  const transformedValue = transform(
                    attribute.value.value,
                    theme
                  )
                  if (Array.isArray(transformedValue)) {
                    const [key, value] = transformedValue
                    attribute.name.name = key
                    attribute.value.value = value
                  } else {
                    attribute.value.value = transformedValue
                  }
                }
                styleAttributes.push(attribute)
              } else {
                attributes.push(attribute)
              }
            })

            if (styleAttributes.length > 0) {
              attributes.push(
                t.jsxAttribute(
                  t.jsxIdentifier('css'),
                  t.jsxExpressionContainer(
                    t.objectExpression([
                      ...defaultAttributes,
                      ...styleAttributes.map((attribute) =>
                        t.objectProperty(
                          t.identifier(attribute.name.name),
                          attribute.value
                        )
                      ),
                    ])
                  )
                )
              )
            }

            path.node.openingElement.attributes = attributes
          }
        })

        // if (path.node.name.name === 'Graphic') {
        //   transformGraphic(path)
        // }

        // add component source information
        // if (
        //   path.node.name.name !== 'Fragment' &&
        //   path.node.name.property?.name !== 'Fragment'
        // ) {
        //   const location = path.container.openingElement.loc
        //   if (!state.fileNameIdentifier) {
        //     const fileName = state.filename || ''
        //     const fileNameIdentifier =
        //       path.scope.generateUidIdentifier(FILE_NAME_ID)
        //     const scope = path.hub.getScope()
        //     if (scope) {
        //       scope.push({
        //         id: fileNameIdentifier,
        //         init: t.stringLiteral(fileName),
        //       })
        //     }
        //     state.fileNameIdentifier = fileNameIdentifier
        //   }

        //   const trace = makeTrace(
        //     state.fileNameIdentifier,
        //     location.start.line,
        //     location.start.column
        //   )

        //   path.node.attributes.push(
        //     t.jsxAttribute(
        //       t.jsxIdentifier(TRACE_ID),
        //       t.jsxExpressionContainer(trace)
        //     )
        //   )
        // }

        // if (path.node.name.name === 'Overrides') {
        //   const [valuePath] = path.get('attributes')
        //   const expressionPath = valuePath.get('value').get('expression')
        //   const expressionName = expressionPath.node.name
        //   const binding = expressionPath.scope.getBinding(expressionName)
        //   let arrayExpression
        //   if (binding) {
        //     if (!this.cache.has(expressionName)) {
        //       arrayExpression = binding.path.get('init')
        //       this.cache.add(expressionName)
        //     }
        //   } else {
        //     arrayExpression = expressionPath
        //   }
        //   if (arrayExpression) {
        //     arrayExpression.get('elements').forEach((element) => {
        //       // handle already transpiled JSX
        //       if (element.node.type === 'CallExpression') {
        //         const [identifier, objectExpression] = element.node.arguments
        //         // filter out TRACE_ID if it was applied to any Overrides
        //         objectExpression.properties =
        //           objectExpression.properties.filter(
        //             (property) => property.key.name !== TRACE_ID
        //           )
        //         element.node.leadingComments = []
        //         element.replaceWith(
        //           t.arrayExpression([identifier, objectExpression])
        //         )
        //       } else {
        //         const openingElement = element.get('openingElement')
        //         const name = openingElement.node.name.name
        //         const objectValues =
        //           openingElement.node.attributes.map(convertAttribute)
        //         element.replaceWith(
        //           t.arrayExpression([
        //             name[0] === name[0].toUpperCase()
        //               ? t.identifier(name)
        //               : t.stringLiteral(name),
        //             t.objectExpression(objectValues),
        //           ])
        //         )
        //       }
        //     })
        //   }
        // }
      },
    },
  }
}
