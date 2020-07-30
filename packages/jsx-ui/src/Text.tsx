import * as React from 'react'
import capsize from 'capsize'

import { StackContext } from './Contexts'
import { useModifierProps } from './Modifiers'
import { useTokens } from './Tokens'
import { useVariantProps } from './Variants'
import { SharedProps } from './index'
import { parseValue } from './utils'

export type TextProps = {
  as?: any
  family?: string
  size?: string | number
  lineSpacing?: number
  weight?: string | number
  color?: string
  offsetX?: string | number
  offsetY?: string | number
  translateX?: string | number
  translateY?: string | number
  width?: string | number
  height?: string | number
  style?: React.CSSProperties
  children?: React.ReactNode
} & SharedProps

export const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  (props, ref) => {
    const parentAxis = React.useContext(StackContext)
    const modifierProps = useModifierProps<TextProps>(Text, props)
    const {
      as: Component = 'span',
      column,
      row,
      family,
      size,
      lineSpacing = 12,
      weight,
      color,
      offsetX,
      offsetY,
      translateX = 0,
      translateY = 0,
      width = 'max-content',
      height,
      visible = true,
      stackChildStyles,
      style = {},
      children,
      ...restProps
    } = useVariantProps<TextProps>(modifierProps)
    const { fontSizes, fontFamilies, fontWeights, fontMetrics } = useTokens()
    const fontFamilyMetrics = fontMetrics && fontMetrics[family]
    const fontStyles = capsize({
      capHeight: fontSizes[size] || size,
      lineGap: lineSpacing,
      fontMetrics: fontFamilyMetrics,
    })

    if (visible === false) {
      return null
    }

    if (offsetX !== undefined || offsetY !== undefined) {
      style.position = 'absolute'
      style.top = offsetY
      style.left = offsetX
    }

    return (
      <Component
        ref={ref}
        style={{
          gridColumn: column,
          gridRow: row,
          fontFamily: fontFamilies[family] || family,
          fontSize: fontSizes[size] || size,
          fontWeight: fontWeights[weight] || weight,
          transform: `translate(${parseValue(translateX)}, ${parseValue(
            translateY
          )})`,
          width,
          height,
          color,
          ...style,
          ...fontStyles,
          ...stackChildStyles,
        }}
        {...restProps}
      >
        <span
          style={{
            display: 'block',
            marginTop: fontStyles['::before'].marginTop,
          }}
        />
        {children}
        <span
          style={{
            display: 'block',
            marginBottom: fontStyles['::after'].marginBottom,
          }}
        />
      </Component>
    )
  }
)

Text.displayName = 'Text'
