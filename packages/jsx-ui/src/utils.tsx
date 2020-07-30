import * as React from 'react'

import { Spacer } from './Spacer'

/**
 * Utility type for getting props type of React component.
 */
export type PropsOf<
  C extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>
> = JSX.LibraryManagedAttributes<C, React.ComponentPropsWithRef<C>>

/**
 * Utility type for omitting a key from an object
 */
export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

/**
 * Parses number values and adds pixel suffix.
 */
export function parseValue(value) {
  return typeof value === 'number' ? value + 'px' : value
}

/**
 * Parses number values as Spacer
 */
export function parseSpaceValue(value) {
  return typeof value === 'string' || typeof value === 'number' ? (
    <Spacer size={value} />
  ) : (
    value
  )
}

/**
 * Returns the instance of a component.
 */
export function getInstance(instance) {
  return (
    instance.render ||
    (instance.type ? instance.type.render || instance.type : instance)
  )
}

/**
 * Determines if two component instances are the same.
 */
export function isSameInstance(element1, element2) {
  return getInstance(element1).toString() === getInstance(element2).toString()
}
