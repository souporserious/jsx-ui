import React from 'react'
import { Overrides, Text, Stack, Tokens, useTokens } from '@jsxui/react'

function TextField({ strokeWeight, strokeColor, ...props }) {
  const tokens = useTokens()
  return (
    <input
      {...props}
      style={{
        outline: 0,
        border: 'none',
        boxShadow:
          strokeWeight ?? strokeColor
            ? `inset 0px 0px 0px ${strokeWeight}px ${
                tokens.colors[strokeColor] || strokeColor
              }`
            : undefined,
        transition: 'all 200ms ease-out',
        ...props.style,
      }}
    />
  )
}

TextField.variants = {
  hover: () => {
    const [hover, setHover] = React.useState(false)
    return [
      hover,
      {
        onMouseOver: () => setHover(true),
        onMouseOut: () => setHover(false),
      },
    ]
  },
  focus: () => {
    const [focus, setFocus] = React.useState(false)
    return [
      focus,
      {
        onFocus: () => setFocus(true),
        onBlur: () => setFocus(false),
      },
    ]
  },
}

function Field({ name, style, ...props }) {
  return (
    <Stack spaceBetween={16} style={style}>
      <Text as="label" htmlFor={name}>
        {name}
      </Text>
      <TextField
        name={name}
        id={name}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '3px',
        }}
        {...props}
      />
    </Stack>
  )
}

function Button({ title, style, ...restProps }) {
  return (
    <Stack
      axis="x"
      as="button"
      spaceX="minmax(16px, 1fr)"
      spaceY="16px"
      background="brand"
      style={{
        padding: 0,
        border: 'none',
        borderRadius: 3,
        ...style,
      }}
      {...restProps}
    >
      <Text weight={600} color="white">
        {title}
      </Text>
    </Stack>
  )
}

Button.variants = {
  hover: () => {
    const [hover, setHover] = React.useState(false)
    return [
      hover,
      {
        onMouseOver: () => setHover(true),
        onMouseOut: () => setHover(false),
      },
    ]
  },
  focus: () => {
    const [focus, setFocus] = React.useState(false)
    return [
      focus,
      {
        onFocus: () => setFocus(true),
        onBlur: () => setFocus(false),
      },
    ]
  },
}

export default function SignupExample() {
  return (
    <Tokens
      colors={{
        brand: 'hsl(263, 66%, 65%)',
        brandLight: 'hsl(263, 66%, 70%)',
        brandLighter: 'hsl(263, 66%, 75%)',
        separator: 'darkgray',
        separatorHover: 'gray',
        separatorFocus: 'brand',
      }}
    >
      <Overrides
        value={[
          <TextField
            strokeWeight={1}
            strokeColor="separator"
            variants={{
              hover: {
                strokeColor: 'separatorHover',
              },
              focus: {
                strokeWeight: 2,
                strokeColor: 'separatorFocus',
              },
            }}
          />,
          <Button
            variants={{
              hover: {
                background: 'brandLight',
              },
              focus: {
                background: 'brandLight',
              },
            }}
          />,
        ]}
      >
        <Stack width="100%" height="100vh" space="1fr">
          <Stack
            as="form"
            onChange={(event) =>
              console.log(event.target.name, event.target.value)
            }
            width="320px"
            strokeWeight={1}
            strokeColor="separator"
          >
            <Stack space={32} background="brand">
              <Text width="1fr" size={24} color="white">
                Signup
              </Text>
            </Stack>
            <Stack space={32} spaceBetween={32}>
              <Stack width="1fr" spaceBetween={24}>
                <Field name="Name" />
                <Field name="Email" type="email" />
                <Field name="Password" type="password" />
              </Stack>
              <Button title="Submit" width="1fr" />
            </Stack>
          </Stack>
        </Stack>
      </Overrides>
    </Tokens>
  )
}
