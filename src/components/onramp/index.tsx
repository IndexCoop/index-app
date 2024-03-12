import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'

type OnrampModalProps = {
  address?: string
  isOpen: boolean
  onClose: () => void
}

export const OnrampModal = (props: OnrampModalProps) => {
  const { isOpen, onClose } = props
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered scrollBehavior='inside'>
      <ModalOverlay className='bg-ic-black bg-opacity-60 backdrop-blur' />
      <ModalContent className='border-ic-gray-100 bg-ic-white mx-0 my-0 rounded-xl border-2 p-0'>
        <ModalHeader>Buy</ModalHeader>
        <ModalCloseButton />
        <ModalBody className='m-0 p-0'>
          <iframe
            src='https://buy.onramper.com?apiKey=pk_prod_01HREVCX1YJDHAHQ6BE777J41B&mode=buy&defaultCrypto=usdc_ethereum&onlyCryptos=dai_ethereum,usdc_ethereum,usdt_ethereum,eth,weth_ethereum,gusd_ethereum,eth_arbitrum,usdc_arbitrum,usdt_arbitrum&onlyCryptoNetworks=ethereum,arbitrum?themeName=light&containerColor=fcffffff&primaryColor=0f1717ff&secondaryColor=fcffffff&cardColor=f5f7f7ff&primaryTextColor=0f1717ff&secondaryTextColor=627171ff&borderRadius=0.5&wgBorderRadius=1'
            title='Onramper Widget'
            height='600px'
            width='100%'
            // allow='accelerometer; autoplay; camera; gyroscope; payment'
          ></iframe>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
