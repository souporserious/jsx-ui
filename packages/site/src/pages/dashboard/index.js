import React from 'react'
import { Stack, Text, Spacer } from '@jsxui/react'

// https://dribbble.com/shots/13931173-Task-Management-Dashboard/attachments/5541807?mode=media

export default function Index() {
  return (
    <Stack axis="x" height="100vh">
      <Stack width="100px" />
      <Stack width="1fr" space={40} spaceXStart={60} background="#f3f3f3">
        <Stack axis="x" width="1fr">
          <Stack width="1fr">
            <Stack axis="x" height={50} spaceY="1fr" spaceBetween={40}>
              <Text size={12} weight={700}>
                All
              </Text>
              <Text size={12} color="gray">
                My Issues
              </Text>
              <Text size={12} color="gray">
                Design
              </Text>
              <Text size={12} color="gray">
                Development
              </Text>
            </Stack>
            <Spacer size={64} />
            <Text size={8} color="gray">
              Wednesday, 24 July
            </Text>
            <Spacer size={24} />
            <Text size={40}>Welcome Back</Text>
            <Spacer size={16} />
            <Text size={40} weight={700}>
              Kevin!
            </Text>
          </Stack>
          <Stack width="0.5fr">
            <Stack space={16} radius={8} background="white">
              <input placeholder="Search" style={{ border: 'none' }} />
            </Stack>
            <Spacer size={64} />
            <Stack space={32} background="white">
              <Text size={14} weight={700}>
                Project Estimate
              </Text>
              <Spacer size={64} />
              <Stack axis="x" width="1fr">
                <Stack spaceBetween={8}>
                  <Text size={8} color="gray">
                    Team Members
                  </Text>
                  <Text weight={500} size={12}>
                    3
                  </Text>
                </Stack>
                <Spacer />
                <Stack spaceBetween={8}>
                  <Text size={8} color="gray">
                    Tasks
                  </Text>
                  <Text weight={500} size={12}>
                    18
                  </Text>
                </Stack>
                <Spacer size={16} />
                <Stack spaceBetween={8}>
                  <Text size={8} color="gray">
                    Hours
                  </Text>
                  <Text weight={500} size={12}>
                    240
                  </Text>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Spacer size={120} />
        <Stack
          axis="x"
          width="1fr"
          spaceBetween="1fr"
          background={
            <Stack width="1fr" height="1fr" space="1fr">
              <Text>Hello</Text>
            </Stack>
          }
        >
          {['Mon', 'Tues', 'Wed', 'Thu', 'Fri'].map((date, index) => (
            <Stack key={date} height={400} spaceX="1fr">
              <Stack space="1fr" spaceBetween={16}>
                <Text size={12} color="gray">
                  {date}
                </Text>
                <Text size={16} weight={700}>
                  {index}
                </Text>
              </Stack>
              <Spacer size={16} />
              <Stack width={1} height="1fr" background="gray" />
            </Stack>
          ))}
        </Stack>
      </Stack>
      <Stack width={320} spaceX="1fr">
        <Spacer size={32} />
        <Text size={14} weight={700}>
          Kevin Parker
        </Text>
        <Spacer size={8} />
        <Text size={10} color="gray">
          @kevinparker
        </Text>
        <Spacer size={32} />
        <Stack axis="x" width="1fr" space="1fr" spaceBetween={32}>
          <Stack space="1fr" spaceBetween={16}>
            <Text size={8} color="gray">
              In Progress
            </Text>
            <Text weight={500} size={12}>
              3
            </Text>
          </Stack>
          <Stack space="1fr" spaceBetween={16}>
            <Text size={8} color="gray">
              Completed
            </Text>
            <Text weight={500} size={12}>
              12
            </Text>
          </Stack>
          <Stack space="1fr" spaceBetween={16}>
            <Text size={8} color="gray">
              Estimate
            </Text>
            <Text weight={500} size={12}>
              7
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}
