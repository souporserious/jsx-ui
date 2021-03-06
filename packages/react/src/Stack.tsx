import * as React from 'react'
import {
  PolymorphicForwardRefExoticComponent,
  PolymorphicPropsWithoutRef,
  PolymorphicPropsWithRef,
} from 'react-polymorphic-types'

import { StackContext } from './Contexts'
import { Divider } from './Divider'
import { SharedProps } from './index'
import { jsx } from './jsx'
import { Spacer } from './Spacer'
import { useTokens } from './Tokens'
import { useChildren } from './use-children'
import { useLayoutStyles } from './use-layout-styles'
import { parseValue, isSameInstance } from './utils'

const defaultElement = 'div'

export type SpaceValue = number | string | boolean | React.ReactNode

export type StackOwnProps = {
  /** The axis along which children are positioned. */
  axis?: 'x' | 'y'

  /** Determines if the element should flow inline with text elements. */
  inline?: boolean

  /** Defines the width of the view area. */
  width?: number | string

  /** Defines the height of the view area. */
  height?: number | string

  /** Shortcut to set both width and height. */
  size?: number | string

  /** Shortcut to set all space props. */
  space?: SpaceValue

  /** Defines space along the x-axis. */
  spaceX?: SpaceValue

  /** Defines space along the x-start-axis. */
  spaceXStart?: SpaceValue

  /** Defines space along the x-end-axis. */
  spaceXEnd?: SpaceValue

  /** Defines space along the y-axis. */
  spaceY?: SpaceValue

  /** Defines space along the y-start-axis. */
  spaceYStart?: SpaceValue

  /** Defines space along the y-end-axis. */
  spaceYEnd?: SpaceValue

  /** Defines space between child views. */
  spaceBetween?: SpaceValue

  /** Overrides the parent defined cross start space. */
  spaceBefore?: SpaceValue

  /** Overrides the parent defined cross end space. */
  spaceAfter?: SpaceValue

  /** Shortcut to set all radius props. */
  radius?: number

  /** Defines top left radius. */
  radiusTopLeft?: number

  /** Defines top right radius. */
  radiusTopRight?: number

  /** Defines bottom left radius. */
  radiusBottomLeft?: number

  /** Defines bottom right radius. */
  radiusBottomRight?: number

  /** Defines offset along the x-axis. */
  offsetX?: string | number

  /** Defines offset along the y-axis. */
  offsetY?: string | number

  /** Defines translation transforms along the x-axis. */
  translateX?: string | number

  /** Defines translation transforms along the y-axis. */
  translateY?: string | number

  /** Defines scale equal scale transforms. */
  scale?: number

  /** Defines scale transforms along the x-axis. */
  scaleX?: number

  /** Defines scale transforms along the y-axis. */
  scaleY?: number

  /** Defines view stroke weight. */
  strokeWeight?: number

  /** Defines view stroke color. */
  strokeColor?: string

  /** Defines view background. */
  background?: string | React.ReactNode

  style?: React.CSSProperties

  children?: React.ReactNode
} & SharedProps

export type StackProps<
  T extends React.ElementType = typeof defaultElement
> = PolymorphicPropsWithRef<StackOwnProps, T>

function joinChildren(children, separator: any = ', ') {
  const childrenArray = React.Children.toArray(children)
  const lastChildIndex = childrenArray.length - 1
  return childrenArray.reduce((result: any, child: any, index) => {
    if (isSameInstance(child, separator)) {
      const nextResult = [...result]
      nextResult.pop()
      return nextResult.concat(child)
    } else if (index < lastChildIndex) {
      return result.concat([
        child,
        typeof separator === 'string'
          ? separator
          : React.cloneElement(separator, { key: index + '-separator' }),
      ])
    } else {
      return result.concat(child)
    }
  }, [])
}

function parseSpaceValue(value) {
  return typeof value === 'string' ||
    typeof value === 'number' ||
    value === true
    ? jsx(Spacer, { size: value === true ? '1fr' : value })
    : value
}

function getOrthogonalAxis(axis) {
  return axis === 'x' ? 'y' : 'x'
}

type TransformValue = {
  scale?: number
  scaleX?: number
  scaleY?: number
  translateX?: number | string
  translateY?: number | string
}

function getTransformValue({
  scale,
  scaleX = 1,
  scaleY = 1,
  translateX = 0,
  translateY = 0,
}: TransformValue) {
  return `translate(${parseValue(translateX)}, ${parseValue(
    translateY
  )}) scale(${scaleX ?? scale}, ${scaleY ?? scale})`
}

export function getStackLayoutStyles({ width, height }) {
  const style = {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 0,
  } as React.CSSProperties
  if (typeof width === 'string' && width.includes('fr')) {
    style.flexGrow = parseFloat(width)
  } else {
    style.width = width
    style.flexBasis = width
  }
  if (typeof height === 'string' && height.includes('fr')) {
    style.flexGrow = parseFloat(height)
  } else {
    style.height = height
    style.flexBasis = height
  }
  if (style.flexGrow > 0) {
    style.flexBasis = 0
  }
  return style
}

export const Stack: PolymorphicForwardRefExoticComponent<
  StackOwnProps,
  typeof defaultElement
> = React.forwardRef(
  <T extends React.ElementType = typeof defaultElement>(
    {
      as,
      inline,
      axis = 'y',
      size,
      width,
      height,
      space,
      spaceX,
      spaceXStart,
      spaceXEnd,
      spaceY,
      spaceYStart,
      spaceYEnd,
      spaceBetween,
      spaceBefore,
      spaceAfter,
      strokeWeight,
      strokeColor,
      background,
      radius = 0,
      radiusTopLeft,
      radiusTopRight,
      radiusBottomLeft,
      radiusBottomRight,
      scale,
      scaleX,
      scaleY,
      translateX,
      translateY,
      children,
      visible = true,
      style: _style,
      ...restProps
    }: PolymorphicPropsWithoutRef<StackOwnProps, T>,
    ref: React.ForwardedRef<React.ElementRef<T>>
  ) => {
    const Element: React.ElementType = as || defaultElement
    const isMainAxisHorizontal = React.useContext(StackContext)
    const { colors } = useTokens()
    const layoutStyles = useLayoutStyles(
      (isMainAxisHorizontal ? width : height) ?? size
    )
    const isHorizontal = axis === 'x'
    const spaceMainStart = isHorizontal
      ? spaceXStart ?? spaceX ?? space
      : spaceYStart ?? spaceY ?? space
    const spaceMainEnd = isHorizontal
      ? spaceXEnd ?? spaceX ?? space
      : spaceYEnd ?? spaceY ?? space
    const spaceCrossStart = isHorizontal
      ? spaceYStart ?? spaceY ?? space
      : spaceXStart ?? spaceX ?? space
    const spaceCrossEnd = isHorizontal
      ? spaceYEnd ?? spaceY ?? space
      : spaceXEnd ?? spaceX ?? space
    const style = {
      display: inline ? 'inline-flex' : 'flex',
      flexDirection: isHorizontal ? 'row' : 'column',
      boxShadow:
        strokeWeight ?? strokeColor
          ? `inset 0px 0px 0px ${strokeWeight}px ${colors[strokeColor] ||
              strokeColor}`
          : undefined,
      borderRadius: [
        parseValue(radiusTopLeft ?? radius),
        parseValue(radiusTopRight ?? radius),
        parseValue(radiusBottomRight ?? radius),
        parseValue(radiusBottomLeft ?? radius),
      ].join(' '),
      background:
        typeof background === 'string'
          ? colors[background] || background
          : undefined,
      transform: getTransformValue({
        scale,
        scaleX,
        scaleY,
        translateX,
        translateY,
      }),
      position: 'relative',
      zIndex: 1,
      width: width ?? size,
      height: height ?? size,
      minWidth: 0,
      minHeight: 0,
      padding: 0,
      margin: 0,
      ..._style,
      ...layoutStyles,
    }
    const childrenToRender = useChildren(children, (child, childProps) => {
      return (spaceCrossStart ?? spaceCrossEnd) &&
        !isSameInstance(child, [Spacer, Divider]) ? (
        <StackContext.Provider value={getOrthogonalAxis(axis) === 'x'}>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: isHorizontal ? 'column' : 'row',
              minWidth: 0,
              minHeight: 0,
              ...getStackLayoutStyles({
                width: isHorizontal
                  ? childProps.width ?? childProps.size
                  : 'auto',
                height: isHorizontal
                  ? 'auto'
                  : childProps.height ?? childProps.size,
              }),
              // Can we be smart here and split layout props so we can pass them to the wrappers we create?
              ...childProps.style,
            }}
          >
            {parseSpaceValue(childProps.spaceBefore ?? spaceCrossStart)}
            {React.cloneElement(child as any, {
              style: getStackLayoutStyles({
                width: isHorizontal
                  ? 'auto'
                  : childProps.width ?? childProps.size,
                height: isHorizontal
                  ? childProps.height ?? childProps.size
                  : 'auto',
              }),
            })}
            {parseSpaceValue(childProps.spaceAfter ?? spaceCrossEnd)}
          </div>
        </StackContext.Provider>
      ) : (
        child
      )
    })

    if (visible === false) {
      return null
    }

    return (
      <Element ref={ref} style={style} {...restProps}>
        <StackContext.Provider value={isHorizontal}>
          {React.isValidElement(background) && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                zIndex: 0,
                pointerEvents: 'none',
              }}
            >
              {background}
            </div>
          )}
          {parseSpaceValue(spaceMainStart)}
          {spaceBetween
            ? joinChildren(childrenToRender, parseSpaceValue(spaceBetween))
            : childrenToRender}
          {parseSpaceValue(spaceMainEnd)}
        </StackContext.Provider>
      </Element>
    )
  }
)

Stack.displayName = 'Stack'
