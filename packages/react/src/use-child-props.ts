import * as React from 'react'

import { OverridesContext, getOverrideProps } from './Overrides'
import { VariantsContext, getVariantProps } from './Variants'

export function useChildProps() {
  const overridesContext = React.useContext(OverridesContext)
  const variantsContext = React.useContext(VariantsContext)
  return (child) => {
    const { __originalType, ...props } = child.props
    const overrideProps = getOverrideProps(
      overridesContext,
      __originalType,
      props
    )
    const variantProps = getVariantProps(variantsContext, overrideProps)
    return variantProps
  }
}
