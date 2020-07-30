import * as React from 'react'

import { StackContext } from './Contexts'
import { useTokens } from './Tokens'
import { useVariantProps } from './Variants'

type SpacerProps = {
  size?: number | string
  variants?: any
  visible?: boolean | string
}

function parseMinMax(definition) {
  return definition
    .split('minmax(')[1]
    .split(')')[0]
    .split(',')
    .map(value => value.trim())
}

export function Spacer(props: SpacerProps) {
  const { size, visible = true } = useVariantProps<SpacerProps>(props)
  const { fontFamilies } = useTokens()
  const [hover, setHover] = React.useState(false)
  const parentAxis = React.useContext(StackContext)
  const isFractional = typeof size === 'string' && size.includes('fr')
  const style = {
    position: 'relative',
    fontFamily: fontFamilies.body,
  } as any

  if (visible === false) {
    return null
  }

  if (typeof size === 'string' && size.includes('minmax')) {
    const dimension = parentAxis === 'horizontal' ? 'Width' : 'Height'
    const [min, max] = parseMinMax(size)

    // flip grow/shrink based on min/max
    // this will determine whether we use minSize vs maxSize and flexGrow vs flexShrink
    if (max.includes('fr')) {
      const maxFloat = parseFloat(max)
      if (maxFloat < 0) {
        throw new Error('Negative fractional units are invalid.')
      }
      style.flexGrow = maxFloat
    } else if (max.includes('px')) {
      style[`max${dimension}`] = max
    }
    if (min.includes('fr')) {
      throw new Error('Fractional minimums are invalid.')
    } else if (min.includes('px')) {
      style[`min${dimension}`] = min
    }
  } else if (typeof size === 'string' && size.includes('fr')) {
    style.flex = `${parseFloat(size)} 1 0`
  } else {
    style[parentAxis === 'horizontal' ? 'width' : 'height'] = size
  }

  return (
    <div
      style={style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover && (
        <svg
          width={parentAxis === 'horizontal' ? '100%' : isFractional ? 8 : 1}
          height={parentAxis === 'horizontal' ? (isFractional ? 8 : 1) : '100%'}
          style={{
            position: 'absolute',
            [parentAxis === 'horizontal' ? 'top' : 'left']: `calc(50% - ${
              isFractional ? 4 : 0.5
            }px)`,
            zIndex: 100,
          }}
        >
          <defs>
            <pattern
              id="horizontal"
              width="8"
              height="8"
              y="2"
              patternUnits="userSpaceOnUse"
            >
              <polyline
                points="0,0 4,4 8,0"
                fill="none"
                stroke="hotpink"
                strokeWidth="1"
              />
            </pattern>
            <pattern
              id="vertical"
              width="8"
              height="8"
              x="2"
              patternUnits="userSpaceOnUse"
            >
              <polyline
                points="0,0 4,4 0,8"
                fill="none"
                stroke="hotpink"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          {isFractional ? (
            <rect width="100%" height="100%" fill={`url(#${parentAxis})`} />
          ) : (
            <rect width="100%" height="100%" fill="hotpink" />
          )}
        </svg>
      )}
      {hover && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 100,
            backgroundColor:
              parentAxis === 'horizontal'
                ? 'hsla(214, 72%, 56%, 0.5)'
                : 'hsla(214, 84%, 74%, 0.5)',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              backgroundColor: 'hotpink',
              color: 'white',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 0.8,
              padding: '2px 4px',
              whiteSpace: 'nowrap',
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              cursor: 'default',
            }}
          >
            {size}
          </span>
        </div>
      )}
    </div>
  )
}
