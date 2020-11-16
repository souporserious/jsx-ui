import * as t from '@babel/types'
import jsx from '@babel/plugin-syntax-jsx'

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

export default function() {
  return {
    name: 'babel-plugin-jsxui',
    inherits: jsx,
    visitor: {
      JSXOpeningElement(path) {
        if (path.node.name.name === 'Overrides') {
          const [valueProp] = path.node.attributes
          if (valueProp) {
            const { elements } = valueProp.value.expression
            if (elements && elements.length > 0) {
              valueProp.value.expression.elements = elements.map(element => {
                const { name } = element.openingElement.name
                const objectValue = element.openingElement.attributes.map(
                  convertAttribute
                )
                return t.arrayExpression([
                  name[0] === name[0].toUpperCase()
                    ? t.identifier(name)
                    : t.stringLiteral(name),
                  t.objectExpression(objectValue),
                ])
              })
            }
          }
        }
      },
    },
  }
}
