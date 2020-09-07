import * as React from 'react'

import { getInstance } from './utils'

const OverridesContext = React.createContext([])

export function useOverrideProps(component: React.ElementType, props: object) {
  const overridesStack = React.useContext(OverridesContext)
  let modifiedProps = {} as React.ComponentProps<typeof component>
  overridesStack.forEach(overrides => {
    overrides.forEach(override => {
      const components = override.slice(0, -1).map(getInstance)
      const overrideProps = override.slice(-1)[0]
      if (components.includes(getInstance(component))) {
        modifiedProps = {
          ...modifiedProps,
          ...overrideProps,
        }
      }
    })
  })
  return {
    ...modifiedProps,
    ...props,
  }
}

export function override<C extends React.ElementType>(
  component: C,
  props: React.ComponentProps<C>
): [C, React.ComponentProps<C>] {
  return [component, props]
}

export type OverridesProps = {
  value: [React.ElementType, object][]
  children: React.ReactNode
}

export function Overrides({ value, children }: OverridesProps) {
  const parentOverrides = React.useContext(OverridesContext)
  return (
    <OverridesContext.Provider value={[...parentOverrides, value]}>
      {children}
    </OverridesContext.Provider>
  )
}
