import * as React from 'react'

export const VariantsContext = React.createContext([])

export function getVariantProps(variantsContext, { variants, ...props }: any) {
  let mergedProps = { ...props }
  if (variants) {
    Object.entries(variantsContext).forEach(([variant, state]) => {
      const variantProps = variants[variant]
      if (state) {
        if (typeof variantProps === 'function') {
          mergedProps = variantProps(mergedProps, state)
        } else {
          mergedProps = {
            ...mergedProps,
            ...variantProps,
          }
        }
      }
    })
  }
  // check and convert boolean props that have a variant value
  // <Text visible="checkout-success">Success!</Text>
  Object.entries(variantsContext).forEach(([variant, state]) => {
    Object.entries(props).forEach(([prop, value]) => {
      if (value === variant) {
        mergedProps[prop] = state
      }
    })
  })
  return mergedProps
}

export function useVariantProps<Props>(props: Props, localVariants: object) {
  const contextVariants = React.useContext(VariantsContext)
  return getVariantProps(
    {
      ...localVariants,
      ...contextVariants,
    },
    props
  ) as Omit<Props, 'variants'>
}

export type VariantsProps = {
  value: object
  children: React.ReactNode
}

export function Variants({ value, children }: VariantsProps) {
  const parentVariants = React.useContext(VariantsContext)
  return (
    <VariantsContext.Provider
      value={{
        ...parentVariants,
        ...value,
      }}
    >
      {children}
    </VariantsContext.Provider>
  )
}
