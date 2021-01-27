import * as React from 'react'
import mergeProps from 'merge-props'
import dlv from 'dlv'

const ModifiersContext = React.createContext({})

export function useModifierProps({ modifiers = [], ...props }) {
  const contextValue = React.useContext(ModifiersContext)
  let modifierProps = {}
  console.log(modifiers)
  // normalize value to always be an array so it's easier to work with
  if (typeof modifiers === 'string') {
    modifiers = [modifiers]
  }
  modifiers.forEach((modifier) => {
    modifierProps = {
      ...modifierProps,
      ...contextValue[modifier],
    }
  })
  return mergeProps(props, modifierProps)
}

export function Modifiers({ children, ...props }) {
  const contextModifiers = React.useContext(ModifiersContext)
  //   const nextModifiers = React.useMemo(() => {
  //     const collections = { ...props }
  //     for (let collectionKey in collections) {
  //       const tokens = collections[collectionKey]
  //       for (let tokenKey in tokens) {
  //         const value = tokens[tokenKey]
  //         const aliasValue = dlv(collections, [collectionKey, value])
  //         if (aliasValue) {
  //           collections[collectionKey][tokenKey] = aliasValue
  //         }
  //       }
  //     }
  //     return collections
  //   }, [props])
  //   const contextValue = React.useMemo(
  //     () => ({
  //       ...contextModifiers,
  //       ...nextModifiers,
  //     }),
  //     [contextModifiers, nextModifiers]
  //   )
  const contextValue = {
    ...contextModifiers,
    ...props,
  }
  return (
    <ModifiersContext.Provider value={contextValue}>
      {children}
    </ModifiersContext.Provider>
  )
}
