import { colors } from 'styles/colors'

import { Button, Flex, Text, useDisclosure } from '@chakra-ui/react'
import * as Sentry from '@sentry/react'
import { useEthers, useLookupAddress } from '@usedapp/core'

import ConnectModal from './ConnectModal'
import NetworkSelector from './NetworkSelector'

const ConnectButton = () => {
  const { account, deactivate } = useEthers()
  const { isOpen, onOpen, onClose } = useDisclosure()
  let ens = useLookupAddress()

  const handleConnectWallet = () => {
    onOpen()
  }

  const handleDisconnect = () => {
    deactivate()
    onClose()
  }

  const sendWalletConnectionEvent = () => {
    Sentry.captureMessage('Successful Wallet Connection', {
      user: {
        name: account,
      },
    })
  }

  const handleAccount = () => {
    sendWalletConnectionEvent()
    return formatAccountName()
  }

  const formatAccountName = () => {
    if (ens) return `${ens}`
    return (
      account &&
      `${account.slice(0, 6)}...${account.slice(
        account.length - 4,
        account.length
      )}`
    )
  }

  const connectButton = () => {
    return (
      <div>
        <Button
          onClick={handleConnectWallet}
          bg={colors.buttonYellow}
          border='0'
          borderRadius='8'
          color='#000'
          fontSize='lg'
          fontWeight='700'
          padding='6px 30px'
          _hover={{
            transform:
              'translate3d(0px, 2px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          Connect
        </Button>
        <ConnectModal isOpen={isOpen} onClose={onClose} />
      </div>
    )
  }

  const disconnectButton = () => {
    return (
      <Flex direction='row' alignItems='center'>
        <Text fontSize='lg' pr='24px'>
          {handleAccount()}
        </Text>
        <Button
          onClick={handleDisconnect}
          bg={colors.background}
          borderColor={colors.buttonYellow}
          borderRadius='8'
          color={colors.buttonYellow}
          fontSize='lg'
          fontWeight='700'
          padding='6px 30px'
          _hover={{
            transform:
              'translate3d(0px, 2px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          Disconnect
        </Button>
        <NetworkSelector />
      </Flex>
    )
  }

  return account ? disconnectButton() : connectButton()
}
export default ConnectButton
