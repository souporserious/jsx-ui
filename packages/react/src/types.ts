import * as React from 'react'
import { PolymorphicComponentProps } from 'react-polymorphic-box'

export type DefaultProps<
  C extends React.ElementType,
  Props = {}
> = PolymorphicComponentProps<C, Props> & {
  column?: string
  row?: string
  variants?: any
  visible?: boolean | string
}

export type SharedProps = {
  column?: string
  row?: string
  variants?: any
  visible?: boolean | string
}
