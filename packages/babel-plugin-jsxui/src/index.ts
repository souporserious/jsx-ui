import * as t from '@babel/types'
import jsx from '@babel/plugin-syntax-jsx'

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

export default function () {
  return {
    name: 'babel-plugin-jsxui',
    inherits: jsx,
    pre() {
      this.cache = new Set()
    },
    visitor: {
      JSXOpeningElement(path, state) {
        // add component source information
        if (
          path.node.name.name !== 'Fragment' &&
          path.node.name.property?.name !== 'Fragment'
        ) {
          const location = path.container.openingElement.loc
          if (!state.fileNameIdentifier) {
            const fileName = state.filename || ''
            const fileNameIdentifier = path.scope.generateUidIdentifier(
              FILE_NAME_ID
            )
            const scope = path.hub.getScope()
            if (scope) {
              scope.push({
                id: fileNameIdentifier,
                init: t.stringLiteral(fileName),
              })
            }
            state.fileNameIdentifier = fileNameIdentifier
          }

          const trace = makeTrace(
            state.fileNameIdentifier,
            location.start.line,
            location.start.column
          )

          path.node.attributes.push(
            t.jsxAttribute(
              t.jsxIdentifier(TRACE_ID),
              t.jsxExpressionContainer(trace)
            )
          )
        }

        if (path.node.name.name === 'Overrides') {
          const [valuePath] = path.get('attributes')
          const expressionPath = valuePath.get('value').get('expression')
          const expressionName = expressionPath.node.name
          const binding = expressionPath.scope.getBinding(expressionName)
          let arrayExpression
          if (binding) {
            if (!this.cache.has(expressionName)) {
              arrayExpression = binding.path.get('init')
              this.cache.add(expressionName)
            }
          } else {
            arrayExpression = expressionPath
          }
          if (arrayExpression) {
            arrayExpression.get('elements').forEach((element) => {
              // handle already transpiled JSX
              if (element.node.type === 'CallExpression') {
                const [identifier, objectExpression] = element.node.arguments
                // filter out TRACE_ID if it was applied to any Overrides
                objectExpression.properties = objectExpression.properties.filter(
                  (property) => property.key.name !== TRACE_ID
                )
                element.node.leadingComments = []
                element.replaceWith(
                  t.arrayExpression([identifier, objectExpression])
                )
              } else {
                const openingElement = element.get('openingElement')
                const name = openingElement.node.name.name
                const objectValues = openingElement.node.attributes.map(
                  convertAttribute
                )
                element.replaceWith(
                  t.arrayExpression([
                    name[0] === name[0].toUpperCase()
                      ? t.identifier(name)
                      : t.stringLiteral(name),
                    t.objectExpression(objectValues),
                  ])
                )
              }
            })
          }
        }
      },
    },
  }
}
