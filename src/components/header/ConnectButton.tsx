import { headerButtonHover } from 'styles/button'
import { colors, useICColorMode } from 'styles/colors'

import {
  Button,
  Flex,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
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

  const backgroundColor = useColorModeValue(colors.black, colors.white)
  const textColor = useColorModeValue(colors.white, colors.black)
  const fontSize = 'md'
  const fontWeight = 700

  const supportedNetwork = isSupportedNetwork(chainId ?? -1)

  const handleConnectWallet = () => {
    onOpen()
  }

  const handleDisconnect = () => {
    deactivate()
    onClose()
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
          bg={backgroundColor}
          border='0'
          borderRadius='8'
          color={textColor}
          fontSize={fontSize}
          fontWeight={fontWeight}
          padding='6px 30px'
          _hover={headerButtonHover}
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
          fontSize={fontSize}
          m={'0 24px'}
          display={['none', 'none', 'flex', 'flex']}
        >
          {formatAccountName()}
        </Text>
        <Button
          onClick={handleDisconnect}
          background={textColor}
          borderColor={backgroundColor}
          borderRadius='8'
          color={backgroundColor}
          fontSize={fontSize}
          fontWeight={fontWeight}
          padding='6px 30px'
          _hover={headerButtonHover}
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
          fontSize={fontSize}
          fontWeight={fontWeight}
          padding='6px 30px'
          _hover={headerButtonHover}
        >
          Wrong Network
        </Button>
        <ConnectModal isOpen={isOpen} onClose={onClose} />
      </div>
    )
  }

  if (supportedNetwork) {
    return account ? disconnectButton() : connectButton()
  }

  return wrongNetworkButton()
}
export default ConnectButton
