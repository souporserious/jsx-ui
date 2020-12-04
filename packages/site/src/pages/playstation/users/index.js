import React from 'react'
import { Image, Spacer, Stack, Text } from '@jsxui/react'
import { Link } from 'gatsby'

function useUsers(amount = 3) {
  const [users, setUsers] = React.useState([])
  React.useEffect(() => {
    fetch(`https://randomuser.me/api/?results=${amount}`)
      .then((response) => response.json())
      .then(({ results }) => setUsers(results))
  }, [amount])
  return users
}

export default function Users() {
  const users = useUsers()
  return (
    <Stack height="100vh" space="1fr">
      <Text>DUALSHOCK 4 wireless controller connected.</Text>
      <Spacer size={8} />
      <Text>Who is using this controller?</Text>
      <Spacer size={64} />
      <Stack axis="x" spaceBetween="32px">
        <Stack
          as={Link}
          to="/playstation/users/new"
          width="180px"
          height="256px"
          space="1fr"
          background="#1a42ab"
        >
          <Text>New User</Text>
        </Stack>
        {users.map((user, index) => (
          <Stack
            key={index}
            as={Link}
            to="/playstation/menu"
            width="180px"
            height="256px"
            background="#1a42ab"
          >
            <Image
              source={`https://api.adorable.io/avatars/285/${index}`}
              width="180px"
              height="180px"
              style={{ objectFit: 'cover' }}
            />
            <Spacer size={16} />
            <Stack axis="x" spaceXStart={16}>
              <Text>Name</Text>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}
