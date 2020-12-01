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
  (props: CreateElementProps, ref) => {
    const overrideProps = useOverrideProps(props.__originalType, props)
    const { __originalType, __jsxuiSource, ...variantProps } = useVariantProps(
      overrideProps
    )
    return React.createElement(props.__originalType, { ref, ...variantProps })
  }
)

CreateElement.displayName = 'JSXUICreateElement'

export function jsx(type, props, ...children) {
  if (type === React.Fragment) {
    return React.createElement(type, props, ...children)
  } else {
    return React.createElement(
      CreateElement,
      { __originalType: type, ...props },
      ...children
    )
  }
}
