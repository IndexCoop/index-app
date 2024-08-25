import { shortenAddress } from '@/lib/utils'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { Dispatch, SetStateAction } from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
  safes: string[]
  setSafeAddress: Dispatch<SetStateAction<string | null>>
}

export const SelectSafeModal = ({
  setSafeAddress,
  isOpen,
  onClose,
  safes,
}: Props) => {
  const handleSafeClick = (safe: string) => {
    setSafeAddress(safe)
    onClose()
  }
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered scrollBehavior='inside'>
      <ModalOverlay className='bg-ic-black bg-opacity-60 backdrop-blur' />
      <ModalContent className='border-ic-gray-100 dark:border-ic-gray-950 bg-ic-white text-ic-black dark:text-ic-white  mx-0 my-4 max-h-[50%] rounded-xl border-2 p-0 dark:bg-[#1C2C2E]'>
        <ModalHeader>Select a Safe</ModalHeader>
        <ModalCloseButton />
        <ModalBody className='px-0 py-4'>
          {safes.map((safe) => (
            <div
              key={safe}
              className='text-ic-black dark:text-ic-white h-15 hover:bg-ic-gray-100 dark:hover:bg-ic-gray-900 my-1 flex cursor-pointer items-center justify-between px-4 py-2 text-sm font-medium'
              onClick={() => handleSafeClick(safe)}
            >
              {shortenAddress(safe)}
            </div>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
