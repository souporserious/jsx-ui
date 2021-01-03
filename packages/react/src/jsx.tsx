import * as React from 'react'
import mergeProps from 'merge-props'

import { useOverrideProps } from './Overrides'
import { useVariantProps } from './Variants'

export const CreateElement = React.forwardRef((props: any, ref) => {
  const variants = props.__originalType.variants
  const localVariants = {}
  if (variants) {
    for (let key in variants) {
      const variantHook = variants[key]
      const [active, hookProps] = variantHook()
      localVariants[key] = active
      props = mergeProps(hookProps, props)
    }
  }
  const overrideProps = useOverrideProps(props.__originalType, props)
  const { __originalType, __jsxuiSource, ...variantProps } = useVariantProps(
    overrideProps,
    localVariants
  )
  return React.createElement(props.__originalType, { ref, ...variantProps })
})

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
