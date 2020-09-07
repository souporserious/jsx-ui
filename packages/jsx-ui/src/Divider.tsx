import * as React from 'react'

import { StackContext } from './Contexts'
import { useOverrideProps } from './Overrides'
import { SharedProps } from './index'

export type DividerProps = {
  color?: string
  size?: string
} & SharedProps

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  (props, ref) => {
    const parentAxis = React.useContext(StackContext)
    const { color = '#000', size = 1 } = useOverrideProps(Divider, props)
    const isHorizontal = parentAxis === 'horizontal'
    return (
      <div
        ref={ref}
        style={{
          width: isHorizontal ? size : '100%',
          height: isHorizontal ? '100%' : size,
          flexShrink: 0,
          backgroundColor: color,
        }}
      />
    )
  }
)
