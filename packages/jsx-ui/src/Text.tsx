import * as React from 'react'

import { useModifierProps, ChildModifiers } from './Modifiers'
import { useTokens } from './Tokens'
import { useVariantProps } from './Variants'
import { SharedProps } from './index'
import { parseValue } from './utils'

export type TextProps = {
  as?: any
  family?: string
  size?: string | number
  weight?: string | number
  color?: string
  offsetX?: string | number
  offsetY?: string | number
  translateX?: string | number
  translateY?: string | number
  width?: string | number
  height?: string | number
  visible?: boolean | string
  variants?: any
  style?: React.CSSProperties
  children?: React.ReactNode
} & SharedProps

export const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  (props, ref) => {
    const modifierProps = useModifierProps<TextProps>(Text, props)
    const {
      as: Component = 'span',
      column,
      row,
      family,
      size,
      weight,
      color,
      offsetX,
      offsetY,
      translateX = 0,
      translateY = 0,
      width = 'max-content',
      height,
      visible,
      style = {},
      parentAxis,
      children,
      ...restProps
    } = useVariantProps(modifierProps)
    const fontSizes = useTokens('fontSizes')
    const fontFamilies = useTokens('fontFamilies')
    const fontWeights = useTokens('fontWeights')

    if (visible === false) {
      return null
    }

    if (offsetX !== undefined || offsetY !== undefined) {
      style.position = 'absolute'
      style.top = offsetX
      style.left = offsetY
    }

    return (
      <ChildModifiers reset>
        <Component
          ref={ref}
          style={{
            gridColumn: column,
            gridRow: row,
            fontFamily: fontFamilies[family] || family,
            fontSize: fontSizes[size] || size,
            fontWeight: fontWeights[weight] || weight,
            transform:
              translateX ?? translateY
                ? `translate(${parseValue(translateX)}, ${parseValue(
                    translateY
                  )})`
                : undefined,
            width,
            height,
            color,
            ...style,
          }}
          {...restProps}
        >
          {children}
        </Component>
      </ChildModifiers>
    )
  }
)

Text.displayName = 'Text'
