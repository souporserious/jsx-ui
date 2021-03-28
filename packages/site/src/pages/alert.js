import React from 'react'
import { Divider, Overrides, Text, Stack, Tokens } from '@jsxui/react'

// based on: https://getbootstrap.com/docs/5.0/components/alerts/

function Alert({ children, scheme }) {
  return (
    <Overrides
      value={[
        <Text color={`${scheme}Foreground`} />,
        <Link color={`${scheme}Link`} />,
      ]}
    >
      <Stack
        width="1fr"
        space="1rem"
        radius=".25rem"
        background={`${scheme}Background`}
        strokeColor={`${scheme}Separator`}
        strokeWeight={1}
        spaceBetween={16}
      >
        {children}
      </Stack>
    </Overrides>
  )
}

function App() {
  return <Text modifier="heading" />
}

function Link({ children, color, to }) {
  return (
    <Text
      as="a"
      href={to}
      color={color}
      weight={600}
      style={{ textDecoration: 'underline' }}
    >
      {children}
    </Text>
  )
}

export default function AlertExample() {
  return (
    <Tokens
      colors={{
        successForeground: '#0f5132',
        successLink: '#0c4128',
        successBackground: '#d1e7dd',
        successSeparator: '#badbcc',

        dangerForeground: '#842029',
        dangerLink: '#6a1a21',
        dangerBackground: '#f8d7da',
        dangerSeparator: '#f5c2c7',

        warningForeground: '#664d03',
        warningLink: '#523e02',
        warningBackground: '#fff3cd',
        warningSeparator: '#ffecb5',
      }}
    >
      <Stack axis="x" spaceX spaceBetween>
        <Text>Hello</Text>
        <Text>World</Text>
      </Stack>
      <Stack space={64} spaceBetween={32}>
        <Alert scheme="success">
          <Text>
            A simple primary alert with <Link to="#">an example link</Link>.
            Give it a click if you like.
          </Text>
        </Alert>
        <Alert scheme="danger">
          <Text>
            A simple primary alert with <Link to="#">an example link</Link>.
            Give it a click if you like.
          </Text>
        </Alert>
        <Alert scheme="warning">
          <Text>
            A simple primary alert with <Link to="#">an example link</Link>.
            Give it a click if you like.
          </Text>
        </Alert>
        <Alert scheme="warning">
          <Text size={20} weight={600}>
            Well done!
          </Text>
          <Text width="100%" lineSpacing={16}>
            Aww yeah, you successfully read this important alert message. This
            example text is going to run a bit longer so that you can see how
            spacing within an alert works with this kind of content.
          </Text>
          <Divider color="warningForeground" />
          <Text>
            Whenever you need to, be sure to use margin utilities to keep things
            nice and tidy.
          </Text>
        </Alert>
      </Stack>
    </Tokens>
  )
}
