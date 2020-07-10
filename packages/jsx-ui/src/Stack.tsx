import * as React from 'react'

import { useModifierProps, ChildModifiers } from './Modifiers'
import { Spacer } from './Spacer'
import { Text } from './Text'
import { useVariantProps } from './Variants'
import { SharedProps } from './index'
import { isSameInstance, parseValue } from './utils'

export type StackProps = {
  as?: any
  axis?: 'horizontal' | 'vertical'
  size?: number | string
  width?: number | string
  height?: number | string
  minWidth?: number | string
  minHeight?: number | string
  maxWidth?: number | string
  maxHeight?: number | string
  spaceAround?: number | string
  spaceAfter?: number | string
  spaceBefore?: number | string
  spaceBetween?: number | string
  spaceCross?: number | string
  spaceCrossStart?: number | string
  spaceCrossEnd?: number | string
  spaceMain?: number | string
  spaceMainStart?: number | string
  spaceMainEnd?: number | string
  offsetX?: string | number
  offsetY?: string | number
  translateX?: string | number
  translateY?: string | number
  background?: string
  visible?: boolean | string
  variants?: any
  style?: React.CSSProperties
  children?: React.ReactNode
} & SharedProps

export type Cell = {
  element?: any
  index?: number
  size: number
}

/** Use for vertical and horizontal layouts */
export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (props, ref) => {
    const modifierProps = useModifierProps<StackProps>(Stack, props)
    const {
      as: Component = 'div',
      column,
      row,
      axis = 'vertical',
      size,
      width,
      height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      spaceAround,
      spaceMain,
      spaceMainStart,
      spaceMainEnd,
      spaceCross,
      spaceCrossStart,
      spaceCrossEnd,
      spaceBetween,
      spaceBefore,
      spaceAfter,
      background,
      offsetX,
      offsetY,
      translateX = 0,
      translateY = 0,
      visible,
      style = {},
      parentAxis,
      children,
      ...restProps
    } = useVariantProps(modifierProps)

    if (visible === false) {
      return null
    }

    if (offsetX !== undefined || offsetY !== undefined) {
      style.position = 'absolute'
      style.top = offsetX
      style.left = offsetY
    }

    const isHorizontal = axis === 'horizontal'
    const childrenArray = React.Children.toArray(children)
    const trackCells = childrenArray.reduce<Cell[]>((cells, element, index) => {
      const previousElement = childrenArray[index - 1]
      const cell = {
        element,
        size: isSameInstance(element, Text)
          ? 'max-content'
          : React.isValidElement(element)
          ? (isHorizontal ? element.props.width : element.props.height) ??
            element.props.size ??
            'min-content'
          : null,
      }
      const spaceValue =
        (React.isValidElement(previousElement) &&
          previousElement?.props.spaceAfter) ??
        (React.isValidElement(element) && element.props.spaceBefore) ??
        spaceBetween
      if (isSameInstance(element, Spacer)) {
        // @ts-ignore
        return [...cells, { size: element.props.size }]
      } else if (index === 0 || spaceValue === undefined) {
        // @ts-ignore
        return cells.concat(cell)
      } else {
        return [...cells, { size: spaceValue }, cell]
      }
    }, [])
    const spaceMainStartValue = spaceMainStart ?? spaceMain ?? spaceAround
    const spaceMainEndValue = spaceMainEnd ?? spaceMain ?? spaceAround
    const spaceCrossStartValue = spaceCrossStart ?? spaceCross ?? spaceAround
    const spaceCrossEndValue = spaceCrossEnd ?? spaceCross ?? spaceAround
    if (spaceMainStartValue) {
      trackCells.unshift({ size: spaceMainStartValue })
    }
    if (spaceMainEndValue) {
      trackCells.push({ size: spaceMainEndValue })
    }
    return (
      <ChildModifiers reset>
        <Component
          ref={ref}
          style={{
            display: 'grid',
            gridAutoFlow: axis === 'horizontal' ? 'column' : 'row',
            [`gridTemplate${
              isHorizontal ? 'Columns' : 'Rows'
            }`]: trackCells
              .map(cell =>
                typeof cell.size === 'number' ? `${cell.size}px` : cell.size
              )
              .join(' '),
            gridColumn: column,
            gridRow: row,
            width: width ?? size,
            height: height ?? size,
            transform:
              translateX ?? translateY
                ? `translate(${parseValue(translateX)}, ${parseValue(
                    translateY
                  )})`
                : undefined,
            position: 'relative',
            minWidth,
            minHeight,
            maxWidth,
            maxHeight,
            background,
            ...style,
          }}
          {...restProps}
        >
          {trackCells
            .map((cell, index) => ({ ...cell, index: index + 1 }))
            .filter(cell => Boolean(cell.element))
            .map(cell => {
              const cellProps = {
                parentAxis: axis,
                [isHorizontal ? 'column' : 'row']: cell.index,
              }
              const spaceCrossValue = spaceCrossStartValue ?? spaceCrossEndValue
              if (!spaceCrossValue && trackCells.length <= 1) {
                return cell.element
              }
              return (
                <ChildModifiers key={cell.index} value={cellProps}>
                  {spaceCrossValue ? (
                    <Stack
                      axis={isHorizontal ? 'vertical' : 'horizontal'}
                      spaceMainStart={spaceCrossStartValue}
                      spaceMainEnd={spaceCrossEndValue}
                      {...cellProps}
                    >
                      {cell.element}
                    </Stack>
                  ) : (
                    cell.element
                  )}
                </ChildModifiers>
              )
            })}
        </Component>
      </ChildModifiers>
    )
  }
)

Stack.displayName = 'Stack'
