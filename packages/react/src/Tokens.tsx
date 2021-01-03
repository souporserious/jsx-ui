import * as React from 'react'
import dlv from 'dlv'

const TokensContext = React.createContext({})

export function useTokens(): { [key in any]: any } {
  return React.useContext(TokensContext)
}

export function Tokens({ children, ...props }) {
  const contextTokens = React.useContext(TokensContext)
  const nextTokens = React.useMemo(() => {
    const collections = { ...props }
    for (let collectionKey in collections) {
      const tokens = collections[collectionKey]
      for (let tokenKey in tokens) {
        const value = tokens[tokenKey]
        const aliasValue = dlv(collections, [collectionKey, value])
        if (aliasValue) {
          collections[collectionKey][tokenKey] = aliasValue
        }
      }
    }
    return collections
  }, [props])
  const contextValue = React.useMemo(
    () => ({
      ...contextTokens,
      ...nextTokens,
    }),
    [contextTokens, nextTokens]
  )
  return (
    <TokensContext.Provider value={contextValue}>
      {children}
    </TokensContext.Provider>
  )
}
