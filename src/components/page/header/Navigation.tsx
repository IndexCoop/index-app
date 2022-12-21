import { useEffect, useState } from 'react'

import { useColorStyles } from 'styles/colors'
import { useAccount } from 'wagmi'

import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons'
import { Flex, IconButton, useBreakpointValue } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

import { useNetwork } from 'hooks/useNetwork'
import { logConnect } from 'utils/api/analytics'

import NavContent from './NavContent'

const DesktopMenu = () => {
  return (
    <Flex
      align='center'
      display={['none', 'none', 'none', 'flex']}
      flexDirection={'row'}
      justifyContent={'space-between'}
      w='100%'
    >
      <NavContent />
      <ConnectButton
        label='Connect'
        showBalance={{
          smallScreen: false,
          largeScreen: true,
        }}
        accountStatus={{
          smallScreen: 'avatar',
          largeScreen: 'full',
        }}
      />
    </Flex>
  )
}

const MobileMenu = () => {
  const [displayMenu, setDisplayMenu] = useState('none')
  const { styles } = useColorStyles()
  const backgroundColorMobile = styles.background
  return (
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
  )
}

const Navigation = () => {
  const isWeb = useBreakpointValue({
    base: false,
    md: true,
  })

  const { address } = useAccount()
  const { chainId } = useNetwork()

  useEffect(() => {
    if (address === undefined || chainId === undefined) return
    logConnect(address, chainId)
  }, [address])

  const width = isWeb ? 1024 : 340
  return (
    <Flex w={['auto', 'auto', 'auto', width]} flexGrow={[0, 0, 0, 2]}>
      <DesktopMenu />
      <MobileMenu />
    </Flex>
  )
}

export default Navigation
