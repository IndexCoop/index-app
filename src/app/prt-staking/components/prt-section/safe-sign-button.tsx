import { useDisclosure } from '@chakra-ui/react'

import { SelectSafeModal } from '@/app/prt-staking/components/prt-section/select-safe-modal'
import { usePrtStakingContext } from '@/app/prt-staking/provider'
import { useAnalytics } from '@/lib/hooks/use-analytics'
import { useSafeClient } from '@/lib/hooks/use-safe-client'

export function SafeSignButton() {
  const { typedData } = usePrtStakingContext()
  const { safeAddress, safes, setSafeAddress, signTypedData } = useSafeClient()
  const { logEvent } = useAnalytics()
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure()

  const onClick = () => {
    if (!typedData) {
      console.warn('typedData is not defined')
      return
    }

    if (!safeAddress) {
      logEvent('Select Safe Button Clicked')
      onModalOpen()
      return
    }

    logEvent('Sign SafeMessage Button Clicked')
    signTypedData(typedData)
  }

  if (safes === null || safes.length === 0) return null

  return (
    <>
      <button
        className='text-ic-white bg-ic-blue-600 h-14 w-full rounded-[10px] font-bold shadow-[0.5px_1px_2px_0_rgba(0,0,0,0.3)]'
        onClick={onClick}
      >
        {safeAddress ? 'Sign SafeMessage' : 'Select Safe'}
      </button>
      <SelectSafeModal
        setSafeAddress={setSafeAddress}
        isOpen={isModalOpen}
        onClose={onModalClose}
        safes={safes}
      />
    </>
  )
}
