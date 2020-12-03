import * as React from 'react'

import { StackContext } from './Contexts'
import { Divider } from './Divider'
import { DefaultProps } from './index'
import { jsx } from './jsx'
import { Spacer } from './Spacer'
import { Text } from './Text'
import { useTokens } from './Tokens'
import { useLayoutStyles } from './use-layout-styles'
import { parseValue, isSameInstance } from './utils'

export type StackOwnProps = {
  as?: any
  axis?: 'horizontal' | 'vertical'
  size?: number | string
  width?: number | string
  height?: number | string
  space?: number | string
  spaceAfter?: number | string
  spaceBefore?: number | string
  spaceBetween?: number | string
  spaceCross?: number | string
  spaceCrossStart?: number | string
  spaceCrossEnd?: number | string
  spaceMain?: number | string
  spaceMainStart?: number | string
  spaceMainEnd?: number | string
  radius?: number
  radiusTopLeft?: number
  radiusTopRight?: number
  radiusBottomLeft?: number
  radiusBottomRight?: number
  offsetX?: string | number
  offsetY?: string | number
  translateX?: string | number
  translateY?: string | number
  scale?: number
  scaleX?: number
  scaleY?: number
  strokeWeight?: number
  strokeColor?: string
  background?: string | React.ReactNode
  style?: React.CSSProperties
  children?: React.ReactNode
}

export type StackProps<E extends React.ElementType> = DefaultProps<
  E,
  StackOwnProps
>

const defaultElement = 'div'

function joinChildren(children, separator: any = ', ') {
  const childrenArray = React.Children.toArray(children)
  const lastChildIndex = childrenArray.length - 1
  return childrenArray.reduce((result: any, child: any, index) => {
    if (child.type === separator.type) {
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
  return typeof value === 'string' || typeof value === 'number'
    ? jsx(Spacer, { size: value })
    : value
}

function getOrthogonalAxis(axis) {
  return axis === 'horizontal' ? 'vertical' : 'horizontal'
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

export function getStackChildStyles({ width, height }) {
  const style = {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 0,
  } as any
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

export const Stack = React.forwardRef(
  <E extends React.ElementType = typeof defaultElement>(
    props: StackProps<E>,
    ref
  ) => {
    const mainAxis = React.useContext(StackContext)
    const {
      as: Component = 'div',
      axis = 'vertical',
      size,
      width,
      height,
      space,
      spaceMain,
      spaceMainStart,
      spaceMainEnd,
      spaceCross,
      spaceCrossStart,
      spaceCrossEnd,
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
    } = props
    const { colors } = useTokens()
    const flattenedChildren = React.Children.toArray(children)
      .flatMap((child: any) =>
        child && child.type === React.Fragment ? child.props.children : child
      )
      .filter(
        child =>
          // @ts-ignore
          React.isValidElement(child) && child.props.visible !== false
      )
    const layoutStyles = useLayoutStyles(
      (mainAxis === 'horizontal' ? width : height) ?? size
    )
    const style = {
      display: 'flex',
      flexDirection: axis === 'horizontal' ? 'row' : 'column',
      boxShadow:
        strokeWeight ?? strokeColor
          ? `inset 0px 0px 0px ${strokeWeight}px ${strokeColor}`
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
      ...layoutStyles,
      ..._style,
    }
    const childrenToRender =
      spaceCrossStart ?? spaceCrossEnd ?? spaceCross ?? space
        ? flattenedChildren.map((child: any, index) => {
            const type = child.props.__originalType || child.type
            return isSameInstance(type, [Spacer, Divider]) ? (
              child
            ) : (
              <StackContext.Provider
                key={index}
                value={getOrthogonalAxis(axis)}
              >
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: axis === 'horizontal' ? 'column' : 'row',
                    ...getStackChildStyles({
                      width:
                        axis === 'horizontal'
                          ? child.props.width ??
                            (child.type === Text ? 'auto' : child.props.size)
                          : 'auto',
                      height:
                        axis === 'horizontal'
                          ? 'auto'
                          : child.props.height ??
                            (child.type === Text ? 'auto' : child.props.size),
                    }),
                    // Can we be smart here and split layout props so we can pass them to the wrappers we create?
                    ...child.props.style,
                  }}
                >
                  {parseSpaceValue(
                    child.props.spaceBefore ??
                      spaceCrossStart ??
                      spaceCross ??
                      space
                  )}
                  {React.cloneElement(child, {
                    style: getStackChildStyles({
                      width:
                        axis === 'horizontal'
                          ? 'auto'
                          : child.props.width ??
                            (child.type === Text ? 'auto' : child.props.size),
                      height:
                        axis === 'horizontal'
                          ? child.props.height ??
                            (child.type === Text ? 'auto' : child.props.size)
                          : 'auto',
                    }),
                  })}
                  {parseSpaceValue(
                    child.props.spaceAfter ??
                      spaceCrossEnd ??
                      spaceCross ??
                      space
                  )}
                </div>
              </StackContext.Provider>
            )
          })
        : flattenedChildren

    if (visible === false) {
      return null
    }

    return (
      <StackContext.Provider value={axis}>
        <Component ref={ref} style={style} {...restProps}>
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
          {parseSpaceValue(spaceMainStart ?? spaceMain ?? space)}
          {spaceBetween
            ? joinChildren(childrenToRender, parseSpaceValue(spaceBetween))
            : childrenToRender}
          {parseSpaceValue(spaceMainEnd ?? spaceMain ?? space)}
        </Component>
      </StackContext.Provider>
    )
  }
) as <E extends React.ElementType = typeof defaultElement>(
  props: StackProps<E>
) => React.ReactElement

// @ts-ignore
Stack.displayName = 'Stack'
