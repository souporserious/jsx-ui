import { PluginObj, PluginPass } from '@babel/core'
import * as t from '@babel/types'
import jsx from '@babel/plugin-syntax-jsx'
import get from 'dlv'

import { createConfig } from './config'

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

    /** Common values reused throughout your components. */
    theme:
      | (string & {})
      | {
          /** The threshold for layouts across specific screen sizes. */
          breakpoints: any
        }

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

const defaultOptions = createConfig('web')
const getOptions = (state) => {
  if (!state.opts.visitor) {
    console.log(
      '@jsxui/babel-plugin: "visitor" not found. Defaulting to "web" platform.'
    )
    return defaultOptions
  } else {
    return state.opts
  }
}

export default function (): PluginObj<PluginOptions> {
  let styleAttributes, styleProperties
  return {
    name: '@jsxui/babel-plugin',
    inherits: jsx,
    visitor: {
      // TODO: since this plugin manipulates props we need to run it before
      // any other plugin since Babel operates on each node of a plugin at once.
      // Otherwise we end up with transformed JSX which is harder to analyze/mod.
      // https://jamie.build/babel-plugin-ordering.html
      Program: {
        enter() {
          cache = new Set()
          styleAttributes = {}
          styleProperties = {}
        },
        exit(path, state) {
          const { components, visitor } = getOptions(state)
          const importDeclarations = {}

          components.forEach((component) => {
            if (component.source) {
              const importDeclaration = importDeclarations[component.source]
              if (importDeclaration === undefined) {
                importDeclarations[component.source] = []
              }
              if (!importDeclaration?.includes(component.as)) {
                importDeclarations[component.source].push(component.as)
              }
            }
          })

          let importEntries = Object.entries(importDeclarations)
          let containsImportDeclaration = false

          if (importEntries.length > 0) {
            // TODO: move out in a constant and pass state for better optimization
            path.traverse({
              ImportDeclaration(path) {
                /**
                 * Determine if library is already imported and if it is add
                 * the specifier to that.
                 */
                const componentImports =
                  importDeclarations[path.node.source.value]
                if (componentImports) {
                  containsImportDeclaration = true

                  // Filter out from imports since we don't need to add the source
                  importEntries = importEntries.filter(
                    ([key]) => key === path.node.source.value
                  )

                  // Loop through component imports and add them
                  componentImports
                    // Filter out any specifiers that are already defined
                    .filter(
                      (componentName) =>
                        !path.node.specifiers
                          .map((specifier) => specifier.local.name)
                          .includes(componentName)
                    )
                    .forEach((componentName) => {
                      path.node.specifiers.push(
                        t.importSpecifier(
                          t.identifier(componentName),
                          t.identifier(componentName)
                        )
                      )
                    })
                }
              },
            })

            if (!containsImportDeclaration) {
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
            const state = { styleAttributes, styleProperties }
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
            styleProperties,
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
        const { components, theme } = getOptions(state)
        const component = components.find(
          (component) => path.node.openingElement.name.name === component.name
        )

        if (component) {
          const id = path.scope.generateUidIdentifier(component.name)

          path.node.openingElement.name.name = component.as
          path.node.closingElement.name.name = component.as

          const attributes = []
          const defaultProperties = []
          const localStyleAttributes = []
          const localStyleProperties = []
          const breakpointProperties = {}

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

          if (component.defaults) {
            Object.entries(component.defaults).forEach(([key, value]) => {
              localStyleAttributes.push(
                t.jsxAttribute(
                  t.jsxIdentifier(key),
                  t.jsxExpressionContainer(getValueType(value))
                )
              )
            })
            Object.entries(component.defaults).forEach(([key, value]) => {
              defaultProperties.push(
                t.objectProperty(t.identifier(key), getValueType(value))
              )
            })
          }

          path.node.openingElement.attributes.forEach((attribute) => {
            const transform = component.transforms[attribute.name.name]

            /**
             * The visible prop is special and allows completely removing an element
             * for a specific breakpoint or platform.
             */
            if (attribute.name.name === 'visible') {
              // TODO: implement "visible" prop
              // will this just be platform specific and implemented per visitor?
              // web for instance will use display: none, but native should return null?
            }

            /**
             * Create an object property to make it easier when writing visitors.
             * Alternatively, we can store this as an actual object and let users
             * compose them however (e.g. writing to template literals).
             */
            if (transform !== undefined) {
              if (attribute.value.type === 'JSXExpressionContainer') {
                const expression = attribute.value.expression

                // <Stack axis={{ initial: 'x', 'breakpoints.medium': 'y' }} />
                if (expression.type === 'ObjectExpression') {
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
                              t.jsxAttribute(
                                t.jsxIdentifier(key),
                                t.jsxExpressionContainer(getValueType(value))
                              )
                            )
                            localStyleProperties.push(
                              t.objectProperty(
                                t.identifier(key),
                                getValueType(value)
                              )
                            )
                          }
                        )
                      } else {
                        localStyleAttributes.push(
                          t.jsxAttribute(
                            t.jsxIdentifier(property.key.name),
                            t.jsxExpressionContainer(
                              getValueType(transformedValue)
                            )
                          )
                        )
                        localStyleProperties.push(
                          t.objectProperty(
                            t.identifier(property.key.name),
                            getValueType(transformedValue)
                          )
                        )
                      }
                    } else {
                      const breakpoint = get(
                        getOptions(state).theme,
                        property.key.value
                      )
                      const transformedValue = transform(
                        property.value.value,
                        theme
                      )

                      if (breakpointProperties[breakpoint] === undefined) {
                        breakpointProperties[breakpoint] = []
                      }

                      if (typeof transformedValue === 'object') {
                        Object.entries(transformedValue).forEach(
                          ([key, value]) => {
                            breakpointProperties[breakpoint].push(
                              t.objectProperty(
                                t.identifier(key),
                                getValueType(value)
                              )
                            )
                          }
                        )
                      } else {
                        breakpointProperties[breakpoint].push(
                          t.objectProperty(
                            t.identifier(attribute.name.name),
                            getValueType(transformedValue)
                          )
                        )
                      }
                    }
                  })
                } else {
                  // <Stack axis={'x'} />
                  const transformedValue = transform(expression.value, theme)
                  if (typeof transformedValue === 'object') {
                    Object.entries(transformedValue).forEach(([key, value]) => {
                      localStyleAttributes.push(
                        t.jsxAttribute(
                          t.jsxIdentifier(key),
                          t.jsxExpressionContainer(getValueType(value))
                        )
                      )
                      localStyleProperties.push(
                        t.objectProperty(t.identifier(key), getValueType(value))
                      )
                    })
                  } else {
                    localStyleAttributes.push(
                      t.jsxAttribute(
                        t.jsxIdentifier(attribute.name.name),
                        t.jsxExpressionContainer(getValueType(transformedValue))
                      )
                    )
                    localStyleProperties.push(
                      t.objectProperty(
                        t.identifier(attribute.name.name),
                        getValueType(transformedValue)
                      )
                    )
                  }
                }
              } else {
                const transformedValue = transform(attribute.value.value, theme)

                // TODO: how to handle if prop value itself is an object? (e.g. translate={{ x: -5, y: 10 }} )
                // Can we use types to determine or should we only support simple
                // primitive values like string/number?
                if (typeof transformedValue === 'object') {
                  Object.entries(transformedValue).forEach(([key, value]) => {
                    localStyleAttributes.push(
                      t.jsxAttribute(
                        t.jsxIdentifier(key),
                        t.jsxExpressionContainer(getValueType(value))
                      )
                    )
                    localStyleProperties.push(
                      t.objectProperty(t.identifier(key), getValueType(value))
                    )
                  })
                } else {
                  localStyleAttributes.push(
                    t.jsxAttribute(
                      t.jsxIdentifier(attribute.name.name),
                      t.jsxExpressionContainer(getValueType(transformedValue))
                    )
                  )
                  localStyleProperties.push(
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
            styleAttributes[id.name] = localStyleAttributes.filter(
              (attribute, index) => {
                const sameAttributes = localStyleAttributes.filter(
                  ({ name }) => name.name === attribute.name.name
                )
                return sameAttributes.length > 1
                  ? sameAttributes.length === index
                  : true
              }
            )
          }

          if (localStyleProperties.length > 0) {
            styleProperties[id.name] = [
              ...defaultProperties,
              ...localStyleProperties.filter((property, index) => {
                // if same value is present we take the last one since it will
                // be overwritten anyways
                const sameProperties = localStyleProperties.filter(
                  ({ key }) => key.name === property.key.name
                )
                return sameProperties.length > 1
                  ? sameProperties.length === index
                  : true
              }),
              ...Object.entries(breakpointProperties).reduce(
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
          } else {
            styleProperties[id.name] = defaultProperties
          }

          path.node.openingElement.attributes = attributes
        }
      },
    },
  }
}
