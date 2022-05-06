import { useState } from 'react'

import { colors } from 'styles/colors'

import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons'
import {
  Flex,
  IconButton,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react'

import ConnectButton from './header/ConnectButton'
import NavContent from './header/NavContent'

const Navigation = () => {
  const [displayMenu, setDisplayMenu] = useState('none')
  const backgroundColorMobile = useColorModeValue(
    colors.white,
    colors.background
  )
  const isWeb = useBreakpointValue({
    base: false,
    md: true,
    lg: true,
    xl: true,
  })
  const width = isWeb ? 1024 : 340

  return (
    <Flex w={['auto', 'auto', 'auto', width]} flexGrow={['0', '0', '0', '2']}>
      {/* Desktop Menu */}
      <Flex
        align='center'
        display={['none', 'none', 'none', 'flex']}
        flexDirection={'row'}
        w='100%'
        justifyContent={'space-between'}
      >
        <NavContent />
        <ConnectButton />
      </Flex>

      {/* Mobile Menu */}
      <Flex display={['flex', 'flex', 'flex', 'none']} flexDirection={'column'}>
        <IconButton
          aria-label='Open Menu'
          icon={<HamburgerIcon />}
          display={['flex', 'flex', 'flex', 'none']}
          onClick={() => setDisplayMenu('flex')}
        />
        <Flex
          flexDir={'column'}
          align={'center'}
          w='100vw'
          h='100vh'
          position='fixed'
          top='0'
          left='0'
          overflowY={'auto'}
          bgColor={backgroundColorMobile}
          zIndex={30}
          display={displayMenu}
          p={[
            '16px 8px 8px 24px',
            '16px 8px 8px 24px',
            '42px 60px 60px 60px',
            '64px 80px 80px 80px',
          ]}
        >
          <IconButton
            aria-label='Close Menu'
            alignSelf={'flex-end'}
            size={'md'}
            icon={<CloseIcon />}
            onClick={() => setDisplayMenu('none')}
            display={['flex', 'flex', 'flex', 'none']}
          />
          <ConnectButton />
          <NavContent />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Navigation
