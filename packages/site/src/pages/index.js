import React from 'react'
import { Stack, Text } from 'jsx-ui'
import { Link } from 'gatsby'

export default function Index() {
  return (
    <Stack as={Link} to="/users" height="100vh" space="1fr">
      <Text>Press the PS button to use the controller.</Text>
    </Stack>
  )
}
