import * as React from 'react'
import create from 'zustand'
import debounce from 'lodash.debounce'

import { Text } from './Text'
import { useOverrideProps } from './Overrides'
import { useVariantProps } from './Variants'
import { getInstance, isSameInstance } from './utils'

type CreateElementProps = {
  __originalType: React.ElementType
  __jsxuiSource: {
    fileName: string
    lineNumber: number
    columnNumber: number
  }
}

let activeId = null

const useStore = create((set) => ({
  highlightedId: null,
  setHighlightedId: (id) => set({ highlightedId: id }),
}))

export const CreateElement = React.forwardRef(
  ({ __originalType, __jsxuiSource, ...props }: CreateElementProps, ref) => {
    const overrideProps = useOverrideProps(__originalType, props)
    const variantProps = useVariantProps(overrideProps)

    if (__originalType !== React.Fragment) {
      const instance = getInstance(__originalType)
      const instanceName = instance.name || instance
      const highlightedId = useStore((state) => state.highlightedId)
      const setHighlightedId: any = useStore((state) => state.setHighlightedId)
      const id =
        __jsxuiSource.fileName +
        'row' +
        __jsxuiSource.lineNumber +
        'col' +
        __jsxuiSource.columnNumber
      if (highlightedId === id) {
        variantProps.style = {
          ...variantProps.style,
          boxShadow: `0px 0px 0px 1px blue, inset 0px 0px 0px 1px blue`,
        }
      }
      // variantProps.title = instanceName
      if (isSameInstance(__originalType, Text)) {
        variantProps.style = {
          ...variantProps.style,
          outline: 0,
        }
        variantProps.contentEditable = true
        variantProps.suppressContentEditableWarning = true
        variantProps.onInput = debounce((event) => {
          event.stopPropagation()
          fetch('http://localhost:4000/props/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              source: __jsxuiSource,
              value: event.target.innerText,
            }),
          })
        }, 100)
      }

      variantProps.onMouseOver = (event) => {
        event.stopPropagation()
        setHighlightedId(id)
      }
      variantProps.onMouseOut = (event) => {
        setHighlightedId(null)
      }
      // variantProps.onClick = (event) => {
      //   event.stopPropagation()
      //   fetch('http://localhost:4000/props/add', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(__jsxuiSource),
      //   })
      // }
    }

    return React.createElement(__originalType, { ref, ...variantProps })
  }
)

CreateElement.displayName = 'JSXUICreateElement'

export function jsx(type, props, ...children) {
  // TODO: only add __jsxuiSource for "design" components and use the custom pragma only for overrides/variants
  return React.createElement(
    CreateElement,
    { __originalType: type, ...props },
    ...children
  )
}
