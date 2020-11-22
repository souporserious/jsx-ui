import * as React from 'react'

import { useOverrideProps } from './Overrides'
import { useVariantProps } from './Variants'

type CreateElementProps = {
  __originalType: React.ElementType
  __jsxuiSource: {
    fileName: string
    lineNumber: number
    columnNumber: number
  }
}

export const CreateElement = React.forwardRef(
  ({ __originalType, __jsxuiSource, ...props }: CreateElementProps, ref) => {
    const overrideProps = useOverrideProps(__originalType, props)
    const variantProps = useVariantProps(overrideProps)
    return React.createElement(__originalType, { ref, ...variantProps })
  }
)

CreateElement.displayName = 'JSXUICreateElement'

export function jsx(type, props, ...children) {
  return React.createElement(
    CreateElement,
    { __originalType: type, ...props },
    ...children
  )
}
