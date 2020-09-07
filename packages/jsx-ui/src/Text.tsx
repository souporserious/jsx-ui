import * as React from 'react'
import capsize from 'capsize'

import { StackContext } from './Contexts'
import { useOverrideProps } from './Overrides'
import { useTokens } from './Tokens'
import { useVariantProps } from './Variants'
import { SharedProps } from './index'
import { useLayoutStyles } from './use-layout-styles'
import { parseValue } from './utils'

export type TextProps = {
  as?: any
  alignment?: 'left' | 'center' | 'right'
  family?: string
  size?: string | number
  lineSpacing?: number
  weight?: string | number
  backgroundColor?: string
  color?: string
  offsetX?: string | number
  offsetY?: string | number
  translateX?: string | number
  translateY?: string | number
  width?: string | number
  height?: string | number
  spaceAfter?: number | string
  spaceBefore?: number | string
  style?: React.CSSProperties
  children?: React.ReactNode
} & SharedProps

export const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  (props, ref) => {
    const mainAxis = React.useContext(StackContext)
    const overrideProps = useOverrideProps(Text, props)
    const {
      as: Component = 'span',
      alignment,
      column,
      row,
      family,
      size,
      lineSpacing = 0,
      weight,
      backgroundColor,
      color,
      offsetX,
      offsetY,
      translateX = 0,
      translateY = 0,
      width,
      height,
      spaceAfter,
      spaceBefore,
      visible = true,
      stackChildStyles,
      style = {},
      children,
      ...restProps
    } = useVariantProps<TextProps>(overrideProps)
    const layoutStyles = useLayoutStyles(
      mainAxis === 'horizontal' ? width : height
    )
    const {
      colors,
      fontSizes,
      fontFamilies,
      fontWeights,
      fontMetrics,
    } = useTokens()
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
          display: 'inline-block',
          gridColumn: column,
          gridRow: row,
          textAlign: alignment,
          fontFamily: fontFamilies[family] || family,
          fontSize: fontSizes[size] || size,
          fontWeight: fontWeights[weight] || weight,
          backgroundColor: colors[backgroundColor] || backgroundColor,
          color: colors[color] || color,
          transform: `translate(${parseValue(translateX)}, ${parseValue(
            translateY
          )})`,
          width,
          height,
          ...style,
          ...fontStyles,
          ...stackChildStyles,
          ...layoutStyles,
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
