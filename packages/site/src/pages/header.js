import React from 'react'
import { Variants } from '@jsxui/react'

export default function HeaderExample() {
  const [active, setActive] = React.useState(false)
  React.useEffect(() => {
    function handleScroll() {
      setActive(() => window.pageYOffset > 200)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  return (
    <Variants value={{ active }}>
      <div style={{ fontFamily: 'sans-serif' }}>
        <div
          style={{
            padding: 16,
            position: 'sticky',
            top: 0,
            background: 'orange',
            transition: 'all 180ms ease-out',
          }}
          className="component"
          variants={{
            active: {
              style: {
                padding: 32,
                background: 'green',
              },
              className: 'component--active',
            },
          }}
        >
          <span
            variants={{
              active: {
                style: {
                  fontSize: 20,
                  color: 'white',
                },
              },
            }}
          >
            Sticky Header
          </span>
        </div>
        <div style={{ minHeight: '400vh', padding: 32 }}>Content</div>
      </div>
    </Variants>
  )
}
