import { Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react'

import { getTokenForPresaleToken } from '../../constants'
import { DepositProvider } from '../../providers/deposit-provider'
import { PreSaleToken } from '../../types'
import { PreSaleTokenCard } from '../pre-sale-token-card'
import { PreSaleWidget } from '../pre-sale-widget'

type PreSalePopupProps = {
  isOpen: boolean
  onClose: () => void
  token: PreSaleToken | null
}

export const PreSalePopup = (props: PreSalePopupProps) => {
  const { isOpen, onClose, token } = props
  const preSaleToken = getTokenForPresaleToken(token)
  if (!preSaleToken) return null
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay className='bg-ic-black bg-opacity-60 backdrop-blur' />
      <ModalContent className='h-[500px] max-w-4xl bg-transparent shadow-none'>
        <ModalBody className='dark m-0 bg-transparent p-0'>
          <DepositProvider
            preSaleToken={preSaleToken}
            preSaleStatus={token?.status}
          >
            <div className='flex h-full'>
              <div className='align-center max-h-4xl mx-auto my-auto flex max-w-4xl flex-row items-start gap-3'>
                {token && (
                  <div className='w-1/2'>
                    <PreSaleTokenCard
                      token={token}
                      // disable button
                      onClick={undefined}
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
