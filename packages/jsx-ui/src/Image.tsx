import * as React from 'react'

import { useOverrideProps } from './Overrides'
import { SharedProps } from './index'

export type ImageProps = {
  source?: any
  width?: number
  height?: number
  aspectRatio?: string
} & SharedProps

export const Image = React.forwardRef<HTMLSpanElement, ImageProps>(
  (props, ref) => {
    const {
      source,
      column,
      row,
      width,
      height,
      style,
      children,
      ...restProps
    } = useOverrideProps(Image, props)
    return (
      <img
        ref={ref}
        src={source}
        style={{
          column,
          row,
          width,
          height,
          ...style,
        }}
        {...restProps}
      >
        {children}
      </img>
    )
  }
)
