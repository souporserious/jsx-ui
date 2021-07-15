import { PluginObj, PluginPass } from '@babel/core'
import * as t from '@babel/types'
import jsx from '@babel/plugin-syntax-jsx'
import get from 'dlv'

import { addSourceProps } from './add-source-props'
import { transformGraphic } from './graphic'

type PluginOptions = {
  opts: {
    // TODO: rename to elements to better match what they're called in the AST?
    components: {
      /** The name of the component. */
      name: string

      /** What element should this component render as. */
      as: string

      /** What library should this component be imported from. */
      source?: string

      /** What default styles should be applied before merging style props. */
      defaults?: any

      /** Style props to process. */
      props?: any

      /** Transforms to be ran for specific props. */
      transforms?: any
    }[]

    /** The threshold for layouts across specific screen sizes. */
    breakpoints: any

    /** Common values reused throughout your components. */
    theme: any

    /** Describe how style props should be mapped to the respecitve platform. */
    visitor: any
  }
} & PluginPass

function getValueType(value) {
  return typeof value === 'boolean'
    ? t.booleanLiteral(value)
    : typeof value === 'number'
    ? t.numericLiteral(value)
    : typeof value === 'string'
    ? t.stringLiteral(value)
    : null
}

function getAttributeValue(attribute) {
  const valuePath = attribute.get('value')
  // const { confident, value } =
  //   valuePath.node.type === 'JSXExpressionContainer'
  //     ? valuePath.get('expression').evaluate()
  //     : valuePath.evaluate()
  // if (confident) {
  //   return value
  // }
  return valuePath.node.type === 'JSXExpressionContainer'
    ? valuePath.node.expression
    : valuePath.node.value
}

export default function (): PluginObj<PluginOptions> {
  let cache, importDeclarations, styleAttributes
  return {
    name: '@jsxui/babel-plugin',
    inherits: jsx,
    visitor: {
      Program: {
        enter() {
          cache = new Set()
          importDeclarations = []
          styleAttributes = {}
        },
        exit(path, state) {
          const { visitor } = state.opts
          let importEntries = Object.entries(importDeclarations)

          if (importEntries.length > 0) {
            // TODO: move out in a constant and pass state for better optimization
            path.traverse({
              ImportDeclaration(path) {
                const componentImports =
                  importDeclarations[path.node.source.value]
                if (componentImports) {
                  // Filter out from imports since we don't need to add the source
                  importEntries = importEntries.filter(
                    ([key]) => key === path.node.source.value
                  )

                  // Loop through component imports and add them
                  componentImports.forEach((componentName) => {
                    path.node.specifiers.push(
                      t.importSpecifier(
                        t.identifier(componentName),
                        t.stringLiteral(componentName)
                      )
                    )
                  })
                }
              },
            })

            if (importEntries.length > 0) {
              importEntries.forEach(([source, componentImports]) => {
                const importDeclaration = t.importDeclaration(
                  componentImports.map((componentName) =>
                    t.importSpecifier(
                      t.identifier(componentName),
                      t.identifier(componentName)
                    )
                  ),
                  t.stringLiteral(source)
                )
                path.unshiftContainer('body', importDeclaration)
              })
            }
          }

          if (visitor.Program) {
            const state = { styleAttributes }
            if (visitor.Program) {
              visitor.Program.call(state, path, state)
            }
            if (visitor.Program.enter) {
              throw Error(
                'Program.enter does not exist in this visitor pattern.'
              )
            }
            if (visitor.Program.exit) {
              throw Error(
                'Program.exit does not exist in this visitor pattern.'
              )
            }
          }

          path.traverse(visitor, {
            // TODO: better name for this helper, is it too vague?
            getElementId: (path) => {
              const attribute = path.node.attributes.find(
                (attribute) => attribute.name.name === '__jsxuiId'
              )
              return attribute ? attribute.value.value : null
            },
            styleAttributes,
          })

          // TODO: merge with above visitor for less traversals
          path.traverse({
            JSXOpeningElement(path) {
              path.node.attributes = path.node.attributes.filter(
                (attribute) => attribute.name.name !== '__jsxuiId'
              )
            },
          })
        },
      },
      JSXElement(path, state) {
        const { components, theme } = state.opts
        const component = components.find(
          (component) => path.node.openingElement.name.name === component.name
        )

        if (component) {
          const id = path.scope.generateUidIdentifier(component.name)

          path.node.openingElement.name.name = component.as
          path.node.closingElement.name.name = component.as

          const attributes = []
          const defaultAttributes = []
          const localStyleAttributes = []
          const breakpointAttributes = {}

          /**
           * We add a uid to track which style props belong to what instance
           * There's probably a better way to do this.
           */
          attributes.push(
            t.jsxAttribute(
              t.jsxIdentifier('__jsxuiId'),
              t.stringLiteral(id.name)
            )
          )

          if (component.source) {
            const importDeclaration = importDeclarations[component.source]
            if (importDeclaration === undefined) {
              importDeclarations[component.source] = []
            }
            if (!importDeclaration?.includes(component.as)) {
              importDeclarations[component.source].push(component.as)
            }
          }

          if (component.defaults) {
            Object.entries(component.defaults).forEach(([key, value]) => {
              defaultAttributes.push(
                t.objectProperty(t.identifier(key), getValueType(value))
              )
            })
          }

          path.node.openingElement.attributes.forEach((attribute) => {
            const transform = component.transforms[attribute.name.name]

            // console.log(attribute.name.name)

            /**
             * Create an object property to make it easier when writing visitors.
             * Alternatively, we can store this as an actual object and let users
             * compose them however (e.g. writing to template literals).
             */
            if (transform !== undefined) {
              // TODO: for now we're only supporting breakpoints
              // but we need to support expressions like <Stack space={8} />
              if (attribute.value.type === 'JSXExpressionContainer') {
                const expression = attribute.value.expression

                expression.properties.forEach((property) => {
                  if (property.key.name === 'initial') {
                    const transformedValue = transform(
                      property.value.value,
                      theme
                    )

                    if (typeof transformedValue === 'object') {
                      Object.entries(transformedValue).forEach(
                        ([key, value]) => {
                          localStyleAttributes.push(
                            t.objectProperty(
                              t.identifier(key),
                              getValueType(value)
                            )
                          )
                        }
                      )
                    } else {
                      localStyleAttributes.push(
                        t.objectProperty(
                          t.identifier(property.key.name),
                          getValueType(transformedValue)
                        )
                      )
                    }
                  } else {
                    const breakpoint = get(state.opts, property.key.value)
                    const transformedValue = transform(
                      property.value.value,
                      theme
                    )

                    if (breakpointAttributes[breakpoint] === undefined) {
                      breakpointAttributes[breakpoint] = []
                    }

                    if (typeof transformedValue === 'object') {
                      Object.entries(transformedValue).forEach(
                        ([key, value]) => {
                          breakpointAttributes[breakpoint].push(
                            t.objectProperty(
                              t.identifier(key),
                              getValueType(value)
                            )
                          )
                        }
                      )
                    } else {
                      breakpointAttributes[breakpoint].push(
                        t.objectProperty(
                          t.identifier(attribute.name.name),
                          getValueType(transformedValue)
                        )
                      )
                    }
                  }
                })
              } else {
                const transformedValue = transform(attribute.value.value, theme)

                // TODO: how to handle if prop value itself is an object?
                // Can we use types to determine or should we only support simple
                // primitive values like string/number?
                if (typeof transformedValue === 'object') {
                  Object.entries(transformedValue).forEach(([key, value]) => {
                    // console.log(value, getValueType(value))
                    localStyleAttributes.push(
                      t.objectProperty(t.identifier(key), getValueType(value))
                    )
                  })
                } else {
                  localStyleAttributes.push(
                    t.objectProperty(
                      t.identifier(attribute.name.name),
                      getValueType(transformedValue)
                    )
                  )
                }
              }
            } else {
              attributes.push(attribute)
            }
          })

          if (localStyleAttributes.length > 0) {
            styleAttributes[id.name] = [
              ...defaultAttributes,
              ...localStyleAttributes,
              ...Object.entries(breakpointAttributes).reduce(
                (previousValue, [key, properties]) => [
                  ...previousValue,
                  t.objectProperty(
                    t.stringLiteral(key),
                    t.objectExpression(properties)
                  ),
                ],
                []
              ),
            ]
          }

          path.node.openingElement.attributes = attributes
        }
      },
      // JSXOpeningElement(path, state) {
      //   if (path.node.name.name === 'Graphic') {
      //     transformGraphic(path)
      //   }

      //   addSourceProps(path, state, cache)
      // },
    },
  }
}
