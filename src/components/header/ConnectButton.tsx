import { colors } from 'styles/colors'

import { Button, Flex, Text, useDisclosure } from '@chakra-ui/react'
import { useEthers, useLookupAddress } from '@usedapp/core'

import { useNetwork } from 'hooks/useNetwork'
import { isSupportedNetwork } from 'utils'

import ConnectModal from './ConnectModal'
import NetworkSelector from './NetworkSelector'

const ConnectButton = () => {
  const { account, chainId, deactivate } = useEthers()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { changeNetwork } = useNetwork()
  let ens = useLookupAddress()

  const supportedNetwork = isSupportedNetwork(chainId ?? -1)

  const handleConnectWallet = () => {
    onOpen()
  }

  const handleDisconnect = () => {
    deactivate()
    onClose()
  }

  const handleAccount = () => {
    return formatAccountName()
  }

  const onWrongNetworkButtonClicked = () => {
    changeNetwork('1')
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
          bg={colors.icYellow}
          border='0'
          borderRadius='8'
          color={colors.black}
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
      <Flex direction={['column', 'column', 'row', 'row']} alignItems='center'>
        <Text
          fontSize='lg'
          m={'0 24px'}
          display={['none', 'none', 'flex', 'flex']}
        >
          {handleAccount()}
        </Text>
        <Button
          onClick={handleDisconnect}
          background='transparent'
          borderColor={colors.icYellow}
          borderRadius='8'
          color={colors.icYellow}
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

  const wrongNetworkButton = () => {
    return (
      <div>
        <Button
          onClick={onWrongNetworkButtonClicked}
          bg={colors.icRed}
          border='0'
          borderRadius='8'
          color={colors.white}
          fontSize='lg'
          fontWeight='700'
          padding='6px 30px'
          _hover={{
            transform:
              'translate3d(0px, 2px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          Wrong Network
        </Button>
        <ConnectModal isOpen={isOpen} onClose={onClose} />
      </div>
    )
  }

  console.log(chainId, 'isSupported', supportedNetwork)
  if (supportedNetwork) {
    return account ? disconnectButton() : connectButton()
  }

  if (chainId) {
    console.log('showing wront network button')
    return wrongNetworkButton()
  }

  return <div></div>
}
export default ConnectButton
