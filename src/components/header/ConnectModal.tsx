import { colors } from 'styles/colors'

import {
  Box,
  Flex,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

import metamaskIcon from 'assets/metamask.png'
import walletconnectIcon from 'assets/walletconnect.svg'
import { metaMaskLink } from 'constants/externalLinks'

export default function ConnectModal(props: { isOpen: any; onClose: any }) {
  const { activateBrowserWallet, activate, account } = useEthers()
  const isMetaMaskInstalled = window.ethereum?.isMetaMask

  const handleMetamask = () => {
    activateBrowserWallet()
    props.onClose()
  }

  const handleWalletConnect = () => {
    const wc = new WalletConnectConnector({
      rpc: {
        1:
          process.env.REACT_APP_MAINNET_ALCHEMY_API ||
          'https://eth-mainnet.alchemyapi.io/v2/Z3DZk23EsAFNouAbUzuw9Y-TvfW9Bo1S',
      },
      chainId: 1,
    })
    activate(wc, (err) => {
      props.onClose()
      console.error(err)
    })
  }

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered size='md'>
      <ModalOverlay />
      <ModalContent
        background={colors.background}
        border='2px'
        borderStyle='solid'
        borderRadius={10}
        borderColor={colors.icWhite}
      >
        <ModalHeader color='white' px={4} fontSize='lg' fontWeight='medium'>
          Connect to wallet
        </ModalHeader>
        <ModalCloseButton
          color='white'
          fontSize='sm'
          _hover={{
            color: 'whiteAlpha.700',
            borderColor: colors.icWhite,
          }}
          _focus={{
            borderColor: colors.icWhite,
          }}
        />
        <ModalBody pt={0} px={4}>
          {isMetaMaskInstalled && (
            <Box
              border='1px'
              borderStyle='solid'
              borderColor={colors.icWhite}
              onClick={handleMetamask}
              _hover={{ borderColor: colors.icWhite }}
              px={5}
              pt={4}
              pb={2}
              mb={3}
            >
              <Flex justifyContent='space-between' alignItems='center' mb={3}>
                <Text color='white' fontSize='lg'>
                  MetaMask
                </Text>
                <Image src={metamaskIcon} width={'10%'} />
              </Flex>
            </Box>
          )}
          {!isMetaMaskInstalled && (
            <Link href={metaMaskLink} target='_blank'>
              <Box
                border='1px'
                borderStyle='solid'
                borderColor={colors.icWhite}
                _hover={{ borderColor: colors.icWhite }}
                px={5}
                pt={4}
                pb={2}
                mb={3}
              >
                <Flex justifyContent='space-between' alignItems='center' mb={3}>
                  <Text color='white' fontSize='lg'>
                    Install MetaMask
                  </Text>
                  <Image src={metamaskIcon} width={'10%'} />
                </Flex>
              </Box>
            </Link>
          )}
          <Box
            border='1px'
            borderStyle='solid'
            borderColor={colors.icWhite}
            onClick={handleWalletConnect}
            _hover={{ borderColor: colors.icWhite }}
            px={5}
            pt={4}
            pb={2}
            mb={3}
          >
            <Flex justifyContent='space-between' alignItems='center' mb={3}>
              <Text color='white' fontSize='lg'>
                WalletConnect
              </Text>
              <Image src={walletconnectIcon} width={'10%'} />
            </Flex>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
