import * as React from 'react'

import { getInstance, isSameInstance } from './utils'

export const OverridesContext = React.createContext([])

export function getOverrideProps(overridesContext, component, props) {
  let mergedProps = {
    ...props,
  } as React.ComponentProps<typeof component>
  overridesContext.forEach((override) => {
    let instance = null
    let overrideProps = {}

    if (React.isValidElement(override)) {
      instance = override
      overrideProps = override.props
    } else if (typeof override === 'function') {
      const component = override(mergedProps)
      instance = component
      overrideProps = component.props
    } else {
      ;[instance, overrideProps] = override
    }

    if (isSameInstance(instance, component)) {
      if (typeof override === 'function') {
        mergedProps = overrideProps
      } else {
        mergedProps = {
          ...overrideProps,
          ...mergedProps,
          variants: {
            ...(overrideProps as any).variants,
            ...mergedProps.variants,
          },
        }
      }
    }
  })
  return mergedProps
}

export function useOverrideProps<C extends React.ElementType>(
  component: C,
  props: React.ComponentProps<C>
): React.ComponentProps<C> {
  const overridesContext = React.useContext(OverridesContext)
  return getOverrideProps(overridesContext, component, props)
}

export type OverridesProps = {
  value: React.ReactNode[] | [React.ElementType, object][]
  children: React.ReactNode
}

export function Overrides({ value, children }: OverridesProps) {
  const parentOverrides = React.useContext(OverridesContext)
  return (
    <OverridesContext.Provider value={[...parentOverrides, ...value]}>
      {children}
    </OverridesContext.Provider>
  )
}
