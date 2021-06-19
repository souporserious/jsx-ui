import * as React from 'react'
import mergeProps from 'merge-props'
import { useId } from '@reach/auto-id'

import { useModifierProps } from './Modifiers'
import { useOverrideProps } from './Overrides'
import { useVariantProps } from './Variants'

export const CreateElement = React.forwardRef(function JSXUICreateElement(
  props: any,
  ref
) {
  const uuid = useId()
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
  const modifierProps = useModifierProps(props)
  const overrideProps = useOverrideProps(props.__originalType, {
    __uuid: uuid,
    ...modifierProps,
  })
  const { __originalType, __jsxuiSource, __uuid, children, ...variantProps } =
    useVariantProps(overrideProps, localVariants)

  if (children?.constructor === Array) {
    return React.createElement(
      props.__originalType,
      { ref, ...variantProps },
      ...children
    )
  } else {
    return React.createElement(
      props.__originalType,
      { ref, ...variantProps },
      children
    )
  }
})

export function jsx(type, props, ...children) {
  if (type === React.Fragment) {
    return React.createElement(type, props, ...children)
  } else {
    return React.createElement(CreateElement, {
      __originalType: type,
      children,
      ...props,
    })
  }
}
