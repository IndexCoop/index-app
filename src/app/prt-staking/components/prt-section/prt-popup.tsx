import { Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react'

import { PrtWidget } from '@/app/prt-staking/components/prt-section/prt-widget'
import { usePrtStakingContext } from '@/app/prt-staking/provider'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export function PrtPopup({ isOpen, onClose }: Props) {
  const { token } = usePrtStakingContext()

  if (!token) return

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay className='bg-ic-black bg-opacity-60 backdrop-blur' />
      <ModalContent className='h-[500px] max-w-4xl bg-transparent shadow-none'>
        <ModalBody className='m-0 bg-transparent p-0'>
          <div className='flex h-full'>
            <div className='align-center max-h-4xl mx-auto my-auto flex max-w-4xl flex-row items-start gap-3'>
              <PrtWidget token={token} onClose={onClose} />
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
