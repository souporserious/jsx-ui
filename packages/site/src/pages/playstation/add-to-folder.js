import React from 'react'
import { Divider, Spacer, Stack, Text } from '@jsxui/react'

function TextInput({ value, row, column, onChange }) {
  return (
    <input
      value={value}
      onChange={onChange}
      style={{
        gridColumn: column,
        gridRow: row,
      }}
    />
  )
}

function Field({ label, children, ...props }) {
  return (
    <Stack as="label" axis="x" spaceBetween={8} {...props}>
      <Text>{label}</Text>
      {children}
    </Stack>
  )
}

export default ({ style }) => {
  return (
    <Stack height="100vh" style={style}>
      <Spacer size="32px" />
      <Stack axis="x" spaceXStart="64px" spaceXEnd="1fr">
        <Text size={40}>Add to New Folder</Text>
      </Stack>
      <Spacer size="16px" />
      <Divider size={1} color="white" />
      <Stack space={32} spaceBetween={16}>
        <Field label="Name">
          <TextInput />
        </Field>
        <Field label="Number of items">
          <TextInput />
        </Field>
        <Field label="Sort">
          <TextInput />
        </Field>
      </Stack>
    </Stack>
  )
}
