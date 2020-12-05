import * as React from 'react'

import { isSameInstance } from './utils'

export const OverridesContext = React.createContext([])

export function getOverrideProps(overridesContext, component, props) {
  let overrideProps = {} as React.ComponentProps<typeof component>
  overridesContext.forEach((overrides) => {
    overrides.forEach(([instance, props]) => {
      if (isSameInstance(instance, component)) {
        overrideProps = {
          ...overrideProps,
          ...(typeof props === 'function' ? props(overrideProps) : props),
        }
      }
    })
  })
  return {
    ...overrideProps,
    ...props,
  }
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
  const mergedOverrides = React.useMemo(() => [...parentOverrides, value], [])
  return (
    <OverridesContext.Provider value={mergedOverrides}>
      {children}
    </OverridesContext.Provider>
  )
}
