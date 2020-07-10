import React from 'react'
import { Stack, Text, Variants } from 'jsx-ui'
import { useRovingIndex } from 'use-roving-index'
import { Link } from 'gatsby'

const menuItems = [
  {
    title: `Playstation®Store`,
  },
  {
    title: `What's New`,
  },
  {
    title: `Overwatch: Origins Edition`,
  },
  {
    title: `Horizon Zero Dawn`,
  },
  {
    title: `TV & Video`,
  },
]

export default () => {
  const {
    activeIndex,
    moveActiveIndex,
    moveBackwardDisabled,
    moveForwardDisabled,
  } = useRovingIndex({
    defaultIndex: 1,
    maxIndex: menuItems.length - 1,
  })
  // const stackGeometry = useGeometry()
  // const textGeometry = useGeometry()
  return (
    <Stack height="100vh" spaceMain="minmax(16px, 1fr)" spaceBetween="32px">
      <Stack axis="horizontal" spaceMain="1fr" spaceBetween="32px">
        {[...Array(11).keys()].map((value) => (
          <Stack key={value} size={24} background="white" />
        ))}
      </Stack>
      <Stack
        axis="horizontal"
        width="100%"
        spaceMain="minmax(32px, 1fr)"
        spaceBetween={2}
        translateX={
          activeIndex > 0 ? (activeIndex - 1) * -202 - 208 : undefined
        }
      >
        {menuItems.map((item, index) => (
          <Variants value={{ active: index === activeIndex }}>
            <Stack
              key={item.title}
              as={Link}
              to="/add-to-folder"
              // ref={index === activeIndex ? stackGeometry : undefined}
              width={200}
              height={200}
              background="#1a42ab"
              variants={{
                active: {
                  width: 400,
                  height: 450,
                  spaceBefore: 8,
                  spaceAfter: 8,
                },
              }}
            >
              <Stack size={200} variants={{ active: { size: 400 } }} />
              <Text
                // ref={textGeometry}
                // offsetX={stackGeometry.maxX}
                // offsetY={stackGeometry.maxY}
                visible="active"
                offsetX={0}
                offsetY="calc(100% + 8px)"
                size={40}
                color="white"
              >
                {item.title}
              </Text>
            </Stack>
          </Variants>
        ))}
      </Stack>
      <Stack axis="horizontal">
        <button
          onClick={() =>
            fetch('http://localhost:8080/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: 'Component' }),
            })
              .then((response) => {
                return response.json()
              })
              .then((data) => console.log(data))
          }
        >
          Fetch
        </button>
        <button
          disabled={moveBackwardDisabled}
          onClick={() => moveActiveIndex(-1)}
        >
          Previous
        </button>
        <button
          disabled={moveForwardDisabled}
          onClick={() => moveActiveIndex(1)}
        >
          Next
        </button>
      </Stack>
    </Stack>
  )
}
