import * as React from 'react'

import { getInstance } from './utils'

const ModifiersContext = React.createContext([])

export function useModifierProps<Props>(instance, props) {
  const modifiersStack = React.useContext(ModifiersContext)
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
