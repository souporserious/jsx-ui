import * as React from 'react'

const TokensContext = React.createContext({})

export function useTokens(): { [key in any]: any } {
  return React.useContext(TokensContext)
}

export function Tokens({ value, children }) {
  const tokens = React.useContext(TokensContext)
  return (
    <TokensContext.Provider value={{ ...value, ...tokens }}>
      {children}
    </TokensContext.Provider>
  )
}
