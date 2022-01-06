import { Box, Button, Stack, useColorMode, Text } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const Menu = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return <Box position='absolute' p='2' top='0' right='0'>
    <Stack spacing={ 2 } direction='row' alignItems='center'>
      <a href='https://github.com/sergiubreban/gif-portal-starter' target='_blank' rel="noreferrer"><Text>github</Text></a>
      <Button variant='simple' onClick={ toggleColorMode }>
        { colorMode === 'light' ? <MoonIcon /> : <SunIcon /> }
      </Button>
      {/* <Button variant='simple' onClick={ () => tip(wallet) }>
      tip
    </Button> */}
    </Stack>
  </Box>
}

export default Menu;