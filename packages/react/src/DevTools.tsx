import * as React from 'react'

import { Overrides, OverridesProps } from './Overrides'
import { Spacer } from './Spacer'
import { Stack } from './Stack'
import { Text } from './Text'

const overrides: OverridesProps['value'] = [
  [
    Spacer,
    {
      children: ({ size, mainAxis }) => {
        const [hover, setHover] = React.useState(false)
        const [altDown, setAltDown] = React.useState(false)
        const isFractional = typeof size === 'string' && size.includes('fr')
        React.useEffect(() => {
          function handleKeyDown(event) {
            setAltDown(event.key === 'Alt')
          }
          function handleKeyUp() {
            setAltDown(false)
          }
          window.addEventListener('keydown', handleKeyDown)
          window.addEventListener('keyup', handleKeyUp)
          return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
          }
        }, [])
        return (
          <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          >
            {altDown && hover && (
              <svg
                width={
                  mainAxis === 'horizontal' ? '100%' : isFractional ? 8 : 1
                }
                height={
                  mainAxis === 'horizontal' ? (isFractional ? 8 : 1) : '100%'
                }
                style={{
                  position: 'absolute',
                  [mainAxis === 'horizontal' ? 'top' : 'left']: `calc(50% - ${
                    isFractional ? 4 : 0.5
                  }px)`,
                  zIndex: 100,
                }}
              >
                {isFractional ? (
                  <rect
                    width="100%"
                    height="100%"
                    fill={`url(#${mainAxis}Wave)`}
                  />
                ) : (
                  <rect width="100%" height="100%" fill="hotpink" />
                )}
              </svg>
            )}
            {altDown && hover && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  zIndex: 100,
                  backgroundColor:
                    mainAxis === 'horizontal'
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
      },
    },
  ],
  [
    Text,
    {
      variants: {
        xray: {
          color: 'black',
        },
      },
    },
  ],
  // variants should be able to use props for user composition mergeEvent(props.onClick, () => null)
  // somehow specify state? How can we use hooks possible (reakit) to add things like useHover()
  // there should always be a way to render through CSS if possible
  // mediaQuery: { sm: { row: 1, onClick: null } } -> className=".row-1" onClick={applyWhen(variant, {})}
  // should we go higher-level? Single File JSX? Can only recieve props (dumb components only)
  [
    Stack,
    {
      variants: {
        // design: (props) => ({
        //   onClick: () => {
        //     fetch('http://localhost:4000/props/add', {
        //       method: 'POST',
        //       headers: { 'Content-Type': 'application/json' },
        //       body: JSON.stringify({ name: 'Component' }),
        //     })
        //   },
        // }),
        xray: {
          strokeWeight: 1,
          strokeColor: 'black',
          background: 'white',
        },
      },
    },
  ],
  [
    'path',
    {
      variants: {
        xray: {
          fill: 'url(#diagonalHatch)',
          stroke: 'black',
          strokeWidth: 1,
        },
      },
    },
  ],
]

export function DevTools({ children }) {
  return (
    <Overrides value={overrides}>
      {children}
      <svg width="0" height="0" style={{ display: 'block' }}>
        <defs>
          <pattern
            id="horizontalWave"
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
            id="verticalWave"
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
          <pattern
            id="diagonalHatch"
            width="6"
            height="10"
            patternTransform="rotate(45 0 0)"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="10"
              style={{ stroke: 'black', strokeWidth: 2 }}
            />
          </pattern>
        </defs>
      </svg>
    </Overrides>
  )
}
