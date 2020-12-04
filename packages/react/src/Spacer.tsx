import * as React from 'react'

import { StackContext } from './Contexts'
import { useTokens } from './Tokens'
import { useLayoutStyles } from './use-layout-styles'

type SpacerProps = {
  size?: number | string
  background?: string
  variants?: any
  visible?: boolean | string
  children?: React.ReactNode
}

export function Spacer(props: SpacerProps) {
  const { children, size = '1fr', background, visible = true } = props
  const { fontFamilies } = useTokens()
  const isMainAxisHorizontal = React.useContext(StackContext)
  const layoutStyles = useLayoutStyles(size)

  if (visible === false) {
    return null
  }

  return (
    <div
      style={{
        position: 'relative',
        fontFamily: fontFamilies.body,
        ...layoutStyles,
      }}
    >
      {background ? (
        <svg
          width="100%"
          height="100%"
          style={{ position: 'absolute', inset: 0 }}
        >
          <rect width="100%" height="100%" fill={background} />
        </svg>
      ) : null}
      {typeof children === 'function'
        ? children({ size, isMainAxisHorizontal })
        : children}
    </div>
  )
}
