import * as React from 'react'
import flattenChildren from 'react-keyed-flatten-children'

import { OverridesContext, getOverrideProps } from './Overrides'
import { VariantsContext, getVariantProps } from './Variants'

export function useChildren(
  children: React.ReactNode | React.ReactNode[],
  getChildProps: (child: React.ElementType<any>, props: any) => any
) {
  const overridesContext = React.useContext(OverridesContext)
  const variantsContext = React.useContext(VariantsContext)
  return flattenChildren(children).map((child: any) => {
    if (typeof child === 'string' || child === null || child === undefined) {
      return child
    }
    const { __originalType, ...props } = child.props
    const overrideProps = getOverrideProps(
      overridesContext,
      __originalType,
      props
    )
    const variantProps = getVariantProps(variantsContext, overrideProps)
    return variantProps.visible === false
      ? null
      : getChildProps(child, variantProps)
  })
}
