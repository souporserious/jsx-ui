import * as React from 'react'

import { useOverrideProps } from './Overrides'
import { useVariantProps } from './Variants'

type CreateElementProps = {
  originalType: React.ElementType
}

export const CreateElement = React.forwardRef(
  ({ originalType, ...props }: CreateElementProps, ref) => {
    const overrideProps = useOverrideProps(originalType, props)
    const variantProps = useVariantProps(overrideProps)
    return React.createElement(originalType, { ref, ...variantProps })
  }
)

CreateElement.displayName = 'JSXUICreateElement'

export function jsx(type, props, ...children) {
  return React.createElement(
    CreateElement,
    { originalType: type, ...props },
    ...children
  )
}
