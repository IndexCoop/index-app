import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useState } from 'react'

import { useSignTerms } from '@/lib/providers/sign-terms-provider'
import { colors } from '@/lib/styles/colors'

export const SignTermsModal = () => {
  const { isSignTermsModalOpen, onCloseSignTermsModal, signTermsOfService } =
    useSignTerms()
  const [disabled, setDisabled] = useState(false)

  const handleConfirmClick = async () => {
    setDisabled(true)
    await signTermsOfService()
  }

  return (
    <Modal
      onClose={onCloseSignTermsModal}
      isOpen={isSignTermsModalOpen}
      isCentered
    >
      <ModalOverlay className='bg-ic-black bg-opacity-60 backdrop-blur' />
      <ModalContent className='border-ic-gray-100  mx-4 my-0 rounded-xl border-[2px]'>
        <ModalHeader>
          <div className='text-ic-black dark:text-ic-white pr-4'>
            Please sign the IC Terms of Service
          </div>
        </ModalHeader>
        <ModalCloseButton color={colors.ic.black} />
        <ModalBody p='0 16px 16px 16px'>
          <p className='text-ic-gray-600 mt-4'>
            I confirm that I have read the{' '}
            <Link
              href='https://indexcoop.com/terms-of-service'
              className='underline text-ic-blue-500'
              target='_blank'
            >
              Terms of Service
            </Link>
            , am not a restricted person - including US person - as described in
            the terms, and use the Website in compliance with the terms.
          </p>
          <button
            className='text-ic-white bg-ic-blue-600 mt-12 w-full rounded-lg py-2.5 font-bold disabled:cursor-not-allowed disabled:bg-[#CFD9D9] md:mt-16'
            disabled={disabled}
            onClick={handleConfirmClick}
          >
            Confirm
          </button>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
