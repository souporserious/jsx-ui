import * as React from 'react'

const ModifiersContext = React.createContext({})

export function useModifierProps({ modifiers = [], ...props }) {
  const contextValue = React.useContext(ModifiersContext)
  let modifierProps = {}
  if (typeof modifiers === 'string') {
    modifiers = [modifiers]
  }
  modifiers.forEach((modifier) => {
    modifierProps = {
      ...modifierProps,
      ...contextValue[modifier],
    }
  })
  return { ...modifierProps, ...props }
}

export function Modifiers({ children, ...props }) {
  const contextModifiers = React.useContext(ModifiersContext)
  const contextValue = React.useMemo(
    () => ({
      ...contextModifiers,
      ...props,
    }),
    [contextModifiers, ...Object.values(props)]
  )
  return (
    <ModifiersContext.Provider value={contextValue}>
      {children}
    </ModifiersContext.Provider>
  )
}
