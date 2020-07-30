import * as React from 'react'

import { StackContext } from './Contexts'
import { useModifierProps } from './Modifiers'
import { Spacer } from './Spacer'
import { useVariantProps } from './Variants'
import { SharedProps } from './index'
import { parseValue, parseSpaceValue } from './utils'

export type StackProps = {
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
  background?: string
  style?: React.CSSProperties
  stackChildStyles?: {
    minWidth: number
    minHeight: number
    flexGrow: number
    flexShrink: number
    flexBasis: number
  }
  children?: React.ReactNode
} & SharedProps

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
    minWidth: 0,
    minHeight: 0,
    flexGrow: 0,
    flexShrink: 1,
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

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (props: StackProps, ref) => {
    const modifierProps = useModifierProps<StackProps>(Stack, props)
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
      stackChildStyles,
      children,
      visible = true,
      style: _style,
      ...restProps
    } = useVariantProps<StackProps>(modifierProps)
    const flattenedChildren = React.Children.toArray(children)
      .flatMap((child: any) =>
        child && child.type === React.Fragment ? child.props.children : child
      )
      .filter(
        child =>
          // @ts-ignore
          React.isValidElement(child) && child.props.visible !== false
      )
    const style = {
      display: 'flex',
      flexDirection: axis === 'horizontal' ? 'row' : 'column',
      boxShadow: `0px 0px 0px ${strokeWeight}px ${strokeColor}`,
      borderRadius: [
        parseValue(radiusTopLeft ?? radius),
        parseValue(radiusTopRight ?? radius),
        parseValue(radiusBottomRight ?? radius),
        parseValue(radiusBottomLeft ?? radius),
      ].join(' '),
      background,
      transform: getTransformValue({
        scale,
        scaleX,
        scaleY,
        translateX,
        translateY,
      }),
      position: 'relative',
      zIndex: 1,
      ...stackChildStyles,
      ..._style,
    }
    const childrenToRender =
      spaceCrossStart ?? spaceCrossEnd ?? spaceCross ?? space
        ? flattenedChildren.map((child: any) =>
            child.type === Spacer ? (
              child
            ) : (
              <StackContext.Provider value={getOrthogonalAxis(axis)}>
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: axis === 'horizontal' ? 'column' : 'row',
                    ...getStackChildStyles({
                      width:
                        axis === 'horizontal'
                          ? child.props.width ?? child.props.size
                          : 'auto',
                      height:
                        axis === 'horizontal'
                          ? 'auto'
                          : child.props.height ?? child.props.size,
                    }),
                  }}
                >
                  {parseSpaceValue(
                    child.props.spaceBefore ??
                      spaceCrossStart ??
                      spaceCross ??
                      space
                  )}
                  {React.cloneElement(child, {
                    stackChildStyles: getStackChildStyles({
                      width:
                        axis === 'horizontal'
                          ? 'auto'
                          : child.props.width ?? child.props.size,
                      height:
                        axis === 'horizontal'
                          ? child.props.height ?? child.props.size
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
          )
        : flattenedChildren

    if (visible === false) {
      return null
    }

    if (
      (typeof width === 'string' && width.includes('fr')) ||
      (typeof size === 'string' && size.includes('fr'))
    ) {
      style.flex = `${width} 0 auto`
    } else {
      style.width = width ?? size
    }
    if (
      (typeof height === 'string' && height.includes('fr')) ||
      (typeof size === 'string' && size.includes('fr'))
    ) {
      style.flex = `${height ?? size} 0 auto`
    } else {
      style.height = height ?? size
    }

    return (
      <StackContext.Provider value={axis}>
        <Component ref={ref} style={style} {...restProps}>
          {parseSpaceValue(spaceMainStart ?? spaceMain ?? space)}
          {spaceBetween
            ? joinChildren(childrenToRender, parseSpaceValue(spaceBetween))
            : childrenToRender}
          {parseSpaceValue(spaceMainEnd ?? spaceMain ?? space)}
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
        </Component>
      </StackContext.Provider>
    )
  }
)

Stack.displayName = 'Stack'
