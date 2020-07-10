import * as React from 'react'

import { getInstance } from './utils'

const ModifiersContext = React.createContext([])
const ChildModifiersContext = React.createContext({})

export function useModifierProps<Props>(instance, props) {
  const modifiersStack = React.useContext(ModifiersContext)
  const childModifiers = React.useContext(ChildModifiersContext)
  let modifiedProps = {} as Props
  modifiersStack.forEach(modifiers => {
    modifiers.forEach(modifier => {
      const components = modifier.slice(0, -1).map(getInstance)
      const modifierProps = modifier.slice(-1)[0]
      if (components.includes(getInstance(instance))) {
        modifiedProps = {
          ...modifiedProps,
          ...modifierProps,
        }
      }
    })
  })
  return {
    ...modifiedProps,
    ...childModifiers,
    ...props,
  }
}

export function Modifiers({ value, children }) {
  const parentModifiers = React.useContext(ModifiersContext)
  return (
    <ModifiersContext.Provider value={[...parentModifiers, value]}>
      {children}
    </ModifiersContext.Provider>
  )
}

export function ChildModifiers({
  value,
  reset,
  children,
}: {
  value?: object
  reset?: boolean
  children: React.ReactNode
}) {
  return (
    <ChildModifiersContext.Provider value={reset ? {} : value}>
      {children}
    </ChildModifiersContext.Provider>
  )
}
