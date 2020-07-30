import * as React from 'react'

const VariantsContext = React.createContext([])

export function useVariantProps<Props>({
  variants,
  ...props
}: {
  variants?: object
}) {
  const contextVariants = React.useContext(VariantsContext)
  let mergedProps = { ...props } as Props
  if (variants) {
    const activeVariants = Object.entries(contextVariants)
      .filter(([, active]) => active)
      .map(([prop]) => prop)
    let variantProps = {}
    activeVariants.forEach(activeVariant => {
      variantProps = {
        ...variantProps,
        ...variants[activeVariant],
      }
    })
    mergedProps = {
      ...mergedProps,
      ...variantProps,
    }
  }
  // check and convert boolean props that have a variant value
  Object.entries(contextVariants).forEach(([variant, active]) => {
    Object.entries(props).forEach(([prop, value]) => {
      if (value === variant) {
        mergedProps[prop] = active
      }
    })
  })
  return mergedProps
}

export function Variants({ children, value }) {
  const parentVariants = React.useContext(VariantsContext)
  const variants = React.useMemo(
    () => ({
      ...parentVariants,
      ...value,
    }),
    [...parentVariants, ...Object.values(value)]
  )
  return (
    <VariantsContext.Provider value={variants}>
      {children}
    </VariantsContext.Provider>
  )
}
