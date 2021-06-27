import * as React from 'react'
import { View } from 'react-native'

export function Stack({ alignment, children }) {
  return (
    <View
      style={{
        alignItems: alignment,
      }}
    >
      {children}
    </View>
  )
}
