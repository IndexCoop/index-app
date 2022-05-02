import { useEffect, useState } from 'react'

import { colors, useICColorMode } from 'styles/colors'

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
import { WalletLinkConnector } from '@web3-react/walletlink-connector'

import argentIcon from 'assets/argent.svg'
import coinbaseWalletIcon from 'assets/coinbaseWalletIcon.png'
import metamaskIcon from 'assets/metamask.png'
import rainbowIcon from 'assets/rainbow-wallet.png'
import walletconnectIcon from 'assets/walletconnect.svg'
import { MAINNET, OPTIMISM, POLYGON } from 'constants/chains'
import { metaMaskLink } from 'constants/externalLinks'

export default function ConnectModal(props: { isOpen: any; onClose: any }) {
  const { activateBrowserWallet, activate } = useEthers()
  const { isDarkMode } = useICColorMode()
  const isMetaMaskInstalled = window.ethereum?.isMetaMask

  const [backgroundColor, setBackgroundColor] = useState<string>(
    colors.background
  )
  const [borderColor, setBorderColor] = useState<string>(colors.icWhite)

  useEffect(() => {
    if (isDarkMode) {
      setBackgroundColor(colors.background)
      setBorderColor(colors.icWhite)
    } else {
      setBackgroundColor(colors.white)
      setBorderColor(colors.background)
    }
  }, [isDarkMode])

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

  const handleCoinbaseWallet = () => {
    const cornbase = new WalletLinkConnector({
      url:
        process.env.REACT_APP_MAINNET_ALCHEMY_API ||
        'https://eth-mainnet.alchemyapi.io/v2/Z3DZk23EsAFNouAbUzuw9Y-TvfW9Bo1S',
      appName: 'Index Coop',
      supportedChainIds: [MAINNET.chainId, POLYGON.chainId, OPTIMISM.chainId],
    })
    activate(cornbase, (err) => {
      props.onClose()
      console.error(err)
    })
  }

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered size='md'>
      <ModalOverlay />
      <ModalContent
        background={backgroundColor}
        border='2px'
        borderStyle='solid'
        borderRadius={10}
        borderColor={borderColor}
        color={borderColor}
      >
        <ModalHeader px={4} fontSize='lg' fontWeight='medium'>
          Connect to wallet
        </ModalHeader>
        <ModalCloseButton
          fontSize='sm'
          _hover={{
            color: 'whiteAlpha.700',
            borderColor: borderColor,
          }}
          _focus={{
            borderColor: borderColor,
          }}
        />
        <ModalBody pt={0} px={4} color={borderColor}>
          {isMetaMaskInstalled && (
            <Box
              border='1px'
              borderStyle='solid'
              borderColor={borderColor}
              onClick={handleMetamask}
              _hover={{ borderColor: borderColor }}
              px={5}
              pt={4}
              pb={2}
              mb={3}
            >
              <Flex justifyContent='space-between' alignItems='center' mb={3}>
                <Text fontSize='lg'>MetaMask</Text>
                <Image src={metamaskIcon} width={'10%'} />
              </Flex>
            </Box>
          )}
          {!isMetaMaskInstalled && (
            <Link href={metaMaskLink} target='_blank'>
              <Box
                border='1px'
                borderStyle='solid'
                borderColor={borderColor}
                _hover={{ borderColor: borderColor }}
                px={5}
                pt={4}
                pb={2}
                mb={3}
              >
                <Flex justifyContent='space-between' alignItems='center' mb={3}>
                  <Text fontSize='lg'>Install MetaMask</Text>
                  <Image src={metamaskIcon} width={'10%'} />
                </Flex>
              </Box>
            </Link>
          )}
          <Box
            border='1px'
            borderStyle='solid'
            borderColor={borderColor}
            onClick={handleWalletConnect}
            _hover={{ borderColor: borderColor }}
            px={5}
            pt={4}
            pb={2}
            mb={3}
          >
            <Flex justifyContent='space-between' alignItems='center' mb={3}>
              <Text fontSize='lg'>Argent</Text>
              <Image src={argentIcon} width={'10%'} />
            </Flex>
          </Box>
          <Box
            border='1px'
            borderStyle='solid'
            borderColor={borderColor}
            onClick={handleWalletConnect}
            _hover={{ borderColor: borderColor }}
            px={5}
            pt={4}
            pb={2}
            mb={3}
          >
            <Flex justifyContent='space-between' alignItems='center' mb={3}>
              <Text fontSize='lg'>Rainbow Wallet</Text>
              <Image src={rainbowIcon} width={'10%'} />
            </Flex>
          </Box>
          <Box
            border='1px'
            borderStyle='solid'
            borderColor={borderColor}
            onClick={handleCoinbaseWallet}
            _hover={{ borderColor: borderColor }}
            px={5}
            pt={4}
            pb={2}
            mb={3}
          >
            <Flex justifyContent='space-between' alignItems='center' mb={3}>
              <Text fontSize='lg'>Coinbase Wallet</Text>
              <Image src={coinbaseWalletIcon} width={'10%'} />
            </Flex>
          </Box>
          <Box
            border='1px'
            borderStyle='solid'
            borderColor={borderColor}
            onClick={handleWalletConnect}
            _hover={{ borderColor: borderColor }}
            px={5}
            pt={4}
            pb={2}
            mb={3}
          >
            <Flex justifyContent='space-between' alignItems='center' mb={3}>
              <Text fontSize='lg'>WalletConnect</Text>
              <Image src={walletconnectIcon} width={'10%'} />
            </Flex>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
