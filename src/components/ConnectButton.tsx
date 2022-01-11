import { Button, Flex, Text, useDisclosure } from '@chakra-ui/react'
import { useEthers, useLookupAddress } from '@usedapp/core'

import ConnectModal from './ConnectModal'

const ConnectButton = (props: { handleOpenModal: any }) => {
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

  const getAccountName = () => {
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
          bg='black'
          color='gray.300'
          fontSize='lg'
          fontWeight='medium'
          border='1px solid white'
          borderRadius='0'
          _hover={{
            borderColor: 'gray.700',
            color: 'gray.400',
          }}
          _active={{
            backgroundColor: 'gray.800',
            borderColor: 'gray.700',
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
        <Text fontSize='lg' paddingRight='10px'>
          {getAccountName()}
        </Text>
        <Button
          onClick={handleDisconnect}
          bg='black'
          color='gray.300'
          fontSize='lg'
          fontWeight='medium'
          border='1px solid white'
          borderRadius='0'
          _hover={{
            borderColor: 'gray.700',
            color: 'gray.400',
          }}
          _active={{
            backgroundColor: 'gray.800',
            borderColor: 'gray.700',
          }}
        >
          Disconnect
        </Button>
      </Flex>
    )
  }

  return account ? disconnectButton() : connectButton()
}
export default ConnectButton
