import { Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react'

import { PreSaleTokenCard } from '@/app/pre-sale/components/pre-sale-token-card'

import { DepositProvider } from '../../providers/deposit-provider'
import { PreSaleToken } from '../../types'
import { PreSaleWidget } from '../pre-sale-widget'

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
        <ModalBody className='bg-transparent'>
          <DepositProvider>
            <div className='flex h-screen'>
              <div className='align-center max-h-4xl mx-auto my-auto flex max-w-4xl flex-row items-start gap-3'>
                {token && (
                  <PreSaleTokenCard
                    token={token}
                    onClick={() => console.log('join')}
                  />
                )}
                <PreSaleWidget token={token!} />
              </div>
            </div>
          </DepositProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
