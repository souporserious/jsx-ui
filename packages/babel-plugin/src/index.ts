import { NodePath, PluginObj, PluginPass } from '@babel/core'
import * as t from '@babel/types'
import jsx from '@babel/plugin-syntax-jsx'

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

    /** Common values reused throughout your components. */
    theme: any

    /** Describe how style props should be mapped to the respecitve platform. */
    visitor: any
  }
} & PluginPass

export default function (): PluginObj<PluginOptions> {
  const cache = new Set()
  const importDeclarations = []
  const styleAttributes = {}
  return {
    name: '@jsxui/babel-plugin',
    inherits: jsx,
    visitor: {
      Program: {
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

          path.traverse(visitor, { styleAttributes })
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

          /** We add a uid to track which style props belong to what instance */
          attributes.push(
            t.jsxAttribute(t.jsxIdentifier('uid'), t.stringLiteral(id.name))
          )

          if (component.source) {
            if (importDeclarations[component.source] === undefined) {
              importDeclarations[component.source] = []
            }
            importDeclarations[component.source].push(component.as)
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
                const transformedValue = transform(attribute.value.value, theme)
                if (Array.isArray(transformedValue)) {
                  const [key, value] = transformedValue
                  attribute.name.name = key
                  attribute.value.value = value
                } else {
                  attribute.value.value = transformedValue
                }
              }
              localStyleAttributes.push(attribute)
            } else {
              attributes.push(attribute)
            }
          })

          if (localStyleAttributes.length > 0) {
            styleAttributes[id.name] = [
              ...defaultAttributes,
              ...localStyleAttributes.map((attribute) =>
                t.objectProperty(
                  t.identifier(attribute.name.name),
                  attribute.value
                )
              ),
            ]
          }

          path.node.openingElement.attributes = attributes
        }

        // if (path.node.name.name === 'Graphic') {
        //   transformGraphic(path)
        // }
      },
      // TODO: fix this.cache
      // JSXOpeningElement(path, state) {
      //   addSourceProps(path, state)
      // },
    },
  }
}
