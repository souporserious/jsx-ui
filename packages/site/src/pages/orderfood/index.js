import React from 'react'
import { Image, Stack, Text, Spacer, Divider, Overrides } from '@jsxui/react'
import { usePress } from '@react-aria/interactions'
import GoogleMap, { Marker } from 'react-maps-google'

function Button({ title }) {
  let { pressProps, isPressed } = usePress({})
  return (
    <Stack
      role="button"
      tabIndex={0}
      height={32}
      spaceX="1fr"
      spaceY={16}
      background={isPressed ? 'hsl(214 84% 42%)' : 'hsl(214 82% 51%)'}
      radius={16}
      style={{
        cursor: 'pointer',
      }}
      {...pressProps}
    >
      <Text size={12} color="white">
        {title}
      </Text>
    </Stack>
  )
}

function Card({ title, actions, children, ...restProps }) {
  return (
    <Stack
      space={24}
      radius={8}
      strokeColor="lightgray"
      strokeWeight={1}
      {...restProps}
    >
      <Stack axis="x">
        {typeof title === 'string' ? (
          <Text size={14} weight={600}>
            {title}
          </Text>
        ) : (
          title
        )}
        <Spacer />
        {actions}
      </Stack>
      <Spacer size={24} />
      {children}
    </Stack>
  )
}

function OrderDetails() {
  const [open, setOpen] = React.useState(false)
  return (
    <Card
      title="Order details"
      actions={
        <>
          <button onClick={() => setOpen((bool) => !bool)}>
            {open ? '🔼' : '🔽'}
          </button>
        </>
      }
    >
      {open ? (
        <>
          <Text size={14}>Order# 83308521</Text>
          <Spacer size={16} />
          <Text size={12} color="gray">
            Order placed on Aug 5, 2020, 5:31 PM
          </Text>

          <Spacer size={32} />

          <Text size={14}>Pizza Port Carlsbad</Text>
          <Spacer size={16} />
          <Text size={12} color="gray">
            571 Carlsbad Village Dr, Carlsbad, CA 92008
          </Text>

          <Spacer size={32} />

          <Stack axis="x" width="1fr" spaceBetween="1fr">
            <Text size={12} color="gray">
              Large Pizza Bressi Ranch x 1
            </Text>
            <Text size={12} color="gray">
              $24.25
            </Text>
          </Stack>

          <Spacer size={16} />

          <Divider />

          <Spacer size={16} />

          <Stack axis="x" width="1fr" spaceBetween="1fr">
            <Text size={12} color="gray">
              Subtotal
            </Text>
            <Text size={12} color="gray">
              $24.25
            </Text>
          </Stack>

          <Spacer size={16} />

          <Stack axis="x" width="1fr" spaceBetween="1fr">
            <Text size={12} color="gray">
              Tax
            </Text>
            <Text size={12} color="gray">
              $1.94
            </Text>
          </Stack>

          <Spacer size={16} />

          <Stack axis="x" width="1fr" spaceBetween="1fr">
            <Text size={12} color="gray">
              Tip
            </Text>
            <Text size={12} color="gray">
              $4.85
            </Text>
          </Stack>

          <Spacer size={16} />

          <Divider />

          <Spacer size={16} />

          <Stack axis="x" width="1fr" spaceBetween="1fr">
            <Text size={12} weight={700} color="gray">
              Total:
            </Text>
            <Text size={12} weight={700} color="gray">
              $31.04
            </Text>
          </Stack>
        </>
      ) : (
        <>
          <Text size={12} color="gray">
            Large Pizza Bressi Ranch x 1
          </Text>
          <Spacer size={16} />
          <Text size={12} color="gray">
            Total: $31.04
          </Text>
        </>
      )}
    </Card>
  )
}

export default function Index() {
  return (
    <Overrides value={[<Divider color="lightgray" />]}>
      <Stack height="100vh">
        <Stack
          axis="x"
          height="auto"
          spaceX={16}
          spaceYStart={32}
          spaceYEnd={16}
        >
          <Text weight={500} spaceBefore="1fr" spaceAfter="1fr">
            Track your order
          </Text>
          <Spacer />
          <Image
            source="https://api.adorable.io/avatars/285"
            width={40}
            height={40}
            radius="circle"
          />
        </Stack>
        <Divider />
        <Stack width="1fr" height="1fr" spaceX="minmax(16px, 1fr)" spaceY={24}>
          <Stack
            axis="x"
            width="minmax(320px, 1200px)"
            height="1fr"
            spaceBetween={16}
            style={{ minHeight: 0 }}
          >
            <Stack width="3fr" spaceBetween={16} style={{ overflow: 'auto' }}>
              <Card title="Pizza Port Carlsbad">
                <Text width="1fr" size={12}>
                  571 Carlsbad Village Dr, Carlsbad, CA 92008
                </Text>
                <Spacer size={20} />
                <Button title="Directions" />
              </Card>
              <Card
                title={
                  <Text size={14} weight={600}>
                    Pick up at{' '}
                    <Text size={14} color="#1a73e8" weight={600}>
                      6:02 PM
                    </Text>
                  </Text>
                }
              >
                <Text size={14}>Enjoy your food!</Text>
                <Spacer size={16} />
                <Text width="1fr" size={12} color="gray">
                  If there are any issues with your order, contact ChowNow using
                  the ‘Get help’ section below
                </Text>
              </Card>
              <OrderDetails />
            </Stack>
            <Stack
              width="4fr"
              height="1fr"
              radius={8}
              style={{ overflow: 'hidden' }}
            >
              <GoogleMap apiKey="AIzaSyBxqTRXjhUfGUrPFRGmJUC0rz3hqvia1RM">
                <Marker
                  position={{
                    lat: 33.15988,
                    lng: -117.34773,
                  }}
                />
              </GoogleMap>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Overrides>
  )
}
