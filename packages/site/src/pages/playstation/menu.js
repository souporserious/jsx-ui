import React from 'react'
import { Spacer, Stack, Text, Variants } from '@jsxui/react'
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
    defaultIndex: 0,
    maxIndex: menuItems.length - 1,
  })
  const activeOffset = activeIndex * -200
  const activeSpaceOffset = 16
  const inactiveSpaceOffset = activeIndex > 0 ? (activeIndex - 1) * 2 : 0
  const offset = activeOffset - activeSpaceOffset - inactiveSpaceOffset
  return (
    <Stack height="100vh" spaceY="minmax(16px, 1fr)" spaceBetween="32px">
      <Stack axis="x" spaceX="1fr" spaceBetween="32px">
        {[...Array(11).keys()].map((value) => (
          <Stack key={value} size={24} background="white" />
        ))}
      </Stack>
      <Stack
        axis="x"
        width="100%"
        spaceX="minmax(32px, 1fr)"
        spaceBetween={2}
        translateX={offset}
      >
        {menuItems.map((item, index) => (
          <React.Fragment key={item.title}>
            <Spacer visible={index === activeIndex} size={8} />
            <Variants value={{ active: index === activeIndex }}>
              <Stack
                key={item.title}
                as={Link}
                to="/playstation/add-to-folder"
                width={200}
                height={200}
                background="#1a42ab"
                variants={{
                  active: {
                    width: 400,
                    height: 450,
                  },
                }}
              >
                <Stack size={200} variants={{ active: { size: 400 } }} />
                <Text
                  width="max-content"
                  visible="active"
                  offsetX="calc(100% + 8px)"
                  offsetY="100%"
                  translateY="-100%"
                  size={40}
                  color="white"
                >
                  {item.title}
                </Text>
              </Stack>
            </Variants>
            <Spacer visible={index === activeIndex} size={8} />
          </React.Fragment>
        ))}
      </Stack>
      <Stack axis="x" spaceX="1fr">
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
