import React from 'react'
import { Graphic, Stack, Text } from '@jsxui/react'
import { Link } from 'gatsby'

function Rectangle({ size, width, height, fill }) {
  return (
    <Graphic
      width={size ?? width}
      height={size ?? height}
      viewBox={`0 0 ${size ?? width} ${size ?? height}`}
    >
      <rect
        width={size ?? width}
        height={size ?? height}
        x={0}
        y={0}
        fill={fill}
      />
    </Graphic>
  )
}

export default function Index() {
  return (
    <Stack height="100vh" space="1fr" spaceBetween="32px">
      <Stack
        axis="y"
        spaceX="16px"
        spaceBetween="16px"
        background="pink"
        variants={{
          'breakpoints.medium': {
            axis: 'x',
            spaceBetween: '8px',
          },
        }}
      >
        <Rectangle size={24} fill="blue" />
        <Rectangle size={24} fill="red" />
      </Stack>
      <Stack axis="x" spaceBetween="16px">
        <Rectangle size={24} fill="blue" />
        <Rectangle size={24} fill="blue" />
        <Rectangle size={24} fill="blue" />
      </Stack>
    </Stack>
  )
}
