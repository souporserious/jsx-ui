import React from 'react'
import { Spacer, Stack, Text } from '@jsxui/react'

export default ({ style, column, row }) => {
  return (
    <Stack column={column} row={row} height="100vh" space="1fr" style={style}>
      <Stack spaceY="1fr" spaceBetween={32}>
        <Stack axis="x" spaceBetween={32}>
          <Stack size={100} background="#1a42ab" />
          <Stack spaceBetween={16}>
            <Text size={24}>Create a User</Text>
            <Text width={720}>
              A user will be created on this PS4 and you will be logged in.
              Saved data, screenshots, and other information will be saved even
              after you log out of the system.
            </Text>
          </Stack>
        </Stack>
        <Stack axis="x" spaceBetween={32}>
          <Stack size={100} background="#1a42ab" />
          <Stack spaceBetween={16}>
            <Text size={24}>Play as a Guest</Text>
            <Text width={720}>
              Temporarily log in to this PS4 as a guest without creating a user.
              After you log out, data you created will be deleted.
            </Text>
          </Stack>
        </Stack>
      </Stack>
      <Spacer size={48} />
      <Text size={16}>
        Whichever option you choose, you can use Playstation Network features
        with your Sony Entertainment Network account.
      </Text>
    </Stack>
  )
}
