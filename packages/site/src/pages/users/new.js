import React from 'react'
import { Image, Spacer, Stack, Text } from 'jsx-ui'
import { Link } from 'gatsby'

export default ({ style, column, row }) => {
  return (
    <Stack
      column={column}
      row={row}
      height="100vh"
      spaceAround="1fr"
      style={style}
    >
      <Stack spaceMain="1fr" spaceBetween="32px">
        <Stack axis="horizontal" spaceBetween="32px">
          <Stack size={120} background="#1a42ab" />
          <Stack spaceBetween="8px">
            <Text size={30}>Create a User</Text>
            <Text width={720}>
              A user will be created on this PS4 and you will be logged in.
              Saved data, screenshots, and other information will be saved even
              after you log out of the system.
            </Text>
          </Stack>
        </Stack>
        <Stack axis="horizontal" spaceBetween="32px">
          <Stack size={120} background="#1a42ab" />
          <Stack spaceBetween="8px">
            <Text size={30}>Play as a Guest</Text>
            <Text width={720}>
              Temporarily log in to this PS4 as a guest without creating a user.
              After you log out, data you created will be deleted.
            </Text>
          </Stack>
        </Stack>
      </Stack>
      <Spacer size="48px" />
      <Text size={20}>
        Whichever option you choose, you can use Playstation Network features
        with your Sony Entertainment Network account.
      </Text>
    </Stack>
  )
}
