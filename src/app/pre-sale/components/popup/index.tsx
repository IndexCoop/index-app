import { Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react'

import { DepositProvider } from '../../providers/deposit-provider'
import { PreSaleToken } from '../../types'
import { PreSaleTokenCard } from '../pre-sale-token-card'
import { PreSaleWidget } from '../pre-sale-widget'
import { HighYieldETHIndex } from '@/constants/tokens'

type PreSalePopupProps = {
  isOpen: boolean
  onClose: () => void
  token: PreSaleToken | null
}

export const PreSalePopup = (props: PreSalePopupProps) => {
  const { isOpen, onClose, token } = props
  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      size='full'
      scrollBehavior='inside'
    >
      <ModalOverlay className='bg-ic-black bg-opacity-60 backdrop-blur' />
      <ModalContent className='bg-transparent shadow-none'>
        <ModalBody className='dark bg-transparent'>
          <DepositProvider preSaleToken={HighYieldETHIndex}>
            <div className='flex h-screen'>
              <div className='align-center max-h-4xl mx-auto my-auto flex max-w-4xl flex-row items-start gap-3'>
                {token && (
                  <div className='w-1/2'>
                    <PreSaleTokenCard
                      token={token}
                      onClick={() => console.log('join')}
                    />
                  </div>
                )}
                {token && (
                  <div className='w-1/2'>
                    <PreSaleWidget token={token} />
                  </div>
                )}
              </div>
            </div>
          </DepositProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
