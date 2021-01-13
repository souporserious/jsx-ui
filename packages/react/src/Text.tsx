import * as React from 'react'
import {
  PolymorphicForwardRefExoticComponent,
  PolymorphicPropsWithoutRef,
  PolymorphicPropsWithRef,
} from 'react-polymorphic-types'
import capsize from 'capsize'

import { StackContext } from './Contexts'
import { useTokens } from './Tokens'
import { SharedProps } from './index'
import { useLayoutStyles } from './use-layout-styles'
import { parseValue } from './utils'

const defaultElement = 'span'

export type TextOwnProps = {
  alignment?: 'left' | 'center' | 'right'
  family?: string
  size?: string | number
  lineSpacing?: number
  letterSpacing?: number | string
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
  opacity?: number | string
  style?: React.CSSProperties
  children?: React.ReactNode
} & SharedProps

export type TextProps<
  T extends React.ElementType = typeof defaultElement
> = PolymorphicPropsWithRef<TextOwnProps, T>

export const Text: PolymorphicForwardRefExoticComponent<
  TextOwnProps,
  typeof defaultElement
> = React.forwardRef(
  <T extends React.ElementType = typeof defaultElement>(
    {
      as,
      alignment,
      column,
      row,
      family,
      size,
      lineSpacing = 0,
      letterSpacing,
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
      opacity,
      visible = true,
      style = {},
      children,
      ...restProps
    }: PolymorphicPropsWithoutRef<TextOwnProps, T>,
    ref: React.ForwardedRef<React.ElementRef<T>>
  ) => {
    const Element: React.ElementType = as || defaultElement
    const isMainAxisHorizontal = React.useContext(StackContext)
    const layoutStyles = useLayoutStyles(isMainAxisHorizontal ? width : height)
    const {
      colors,
      fontSizes,
      fontFamilies,
      fontWeights,
      fontMetrics,
    } = useTokens()
    const fontFamilyMetrics = fontMetrics && fontMetrics[family]
    const capHeight = fontSizes[size] || size
    const fontStyles =
      typeof capHeight === 'number' && fontFamilyMetrics
        ? capsize({
            capHeight: capHeight,
            lineGap: lineSpacing,
            fontMetrics: fontFamilyMetrics,
          })
        : {}

    if (visible === false) {
      return null
    }

    if (offsetX !== undefined || offsetY !== undefined) {
      style.position = 'absolute'
      style.top = offsetY
      style.left = offsetX
    }

    return (
      <Element
        ref={ref}
        style={{
          display: 'inline-block',
          minWidth: 0,
          minHeight: 0,
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
          letterSpacing,
          opacity,
          ...style,
          ...fontStyles,
          ...layoutStyles,
        }}
        {...restProps}
      >
        <span
          style={{
            display: 'block',
            marginTop: fontStyles['::before']?.marginTop,
          }}
        />
        {children}
        <span
          style={{
            display: 'block',
            marginBottom: fontStyles['::after']?.marginBottom,
          }}
        />
      </Element>
    )
  }
)

Text.displayName = 'Text'
