import React from 'react'
import { Circle, Stack, Text, Spacer, Overrides } from '@jsxui/react'
import { Link } from 'gatsby'

// based on:
// https://dribbble.com/shots/13922164-Collab-Landing-Page-Kit-I
// https://ui8-collab.herokuapp.com/

function Graphic() {
  return '🔍'
}

function Button({ title, secondary }) {
  return (
    <Stack
      space={24}
      radius={20}
      background={secondary ? '#5956E9' : '#FAB8C4'}
    >
      <Text size={16} weight={500} color={secondary ? 'white' : '#2522BA'}>
        {title}
      </Text>
    </Stack>
  )
}

export default function Index() {
  return (
    <Stack
      height="100vh"
      background={
        <Stack>
          <Circle size={400} positionX={-200} positionY={-200} fill="#FFDC60" />
          <Circle size={48} positionX={200} positionY={200} fill="#FAB8C4" />
          <Circle
            size={128}
            positionX={-200}
            positionY={-200}
            constraintX="center"
            fill="#FFDC60"
          />
          <Circle
            size={32}
            positionX={-200}
            positionY={160}
            constraintX="center"
            fill="#5956E9"
          />
          <Circle
            size={1200}
            positionX={-600}
            positionY={-600}
            constraintX="end"
            fill="#5956E9"
          />
        </Stack>
      }
    >
      <Spacer size={60} />
      <Stack axis="x">
        <Spacer size="minmax(16px, 1fr)" />
        <Stack axis="x" width="minmax(320px, 1140px)" spaceY="1fr">
          <Text>Collab</Text>
          <Spacer size={60} />
          <Stack axis="x" spaceBetween={20}>
            {['Features', 'Pricing', 'Tours', 'Explore'].map((link) => (
              <Text key={link}>{link}</Text>
            ))}
          </Stack>
          <Spacer size="minmax(16px, 1fr)" />
          <Button title="Get Started" />
        </Stack>
        <Spacer size="minmax(16px, 1fr)" />
      </Stack>

      <Stack axis="x">
        <Spacer />
        <Stack>
          <Spacer size={64} />
          <Text size={72} weight={600}>
            Create
            <br />
            Like
            <br />
            Never
            <br />
            Before.
          </Text>
          <Spacer size={32} />
          <Text width={360} size={16}>
            Create, build, collaborate and ship products faster. Good bye code!
            👋
          </Text>
          <Spacer size={48} />
          <Stack axis="x" spaceBetween={8}>
            <Button title="Get Started" secondary />
            <Button title="See It In Action!" />
          </Stack>
        </Stack>
        <Spacer size="3fr" />
      </Stack>

      <Spacer size={64} />

      <Overrides value={[<Text color="white" />]}>
        <Stack
          background={
            <Stack width="100%" height="100%" background="#27272E">
              <Circle
                size={500}
                stroke="#525260"
                positionX={-420}
                constraintX="center"
              />
              <Circle
                size={268}
                fill="#525260"
                positionX={-600}
                positionY={150}
                constraintX="end"
              />
            </Stack>
          }
        >
          <Spacer size={200} />
          <Stack axis="x">
            <Spacer size="minmax(32px, 1fr)" />
            <Text size={12} weight={500}>
              Features
            </Text>
            <Spacer size="minmax(32px, 120px)" />
            <Stack width={680}>
              <Text size={48} weight={500}>
                The world’s most powerful design tool.
              </Text>
              <Spacer size={60} />
              <Text size={16} width={560} color="rgba(255, 255, 255, 0.5)">
                Simultaneously design, code and collaborate with your team all
                from one place.
              </Text>
            </Stack>
            <Spacer size="1fr" />
          </Stack>
          <Spacer size={200} />
        </Stack>
      </Overrides>
    </Stack>
  )
}
