import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'

import { Dispatch, SetStateAction } from 'react'

import { shortenAddress } from '@/lib/utils'

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
    <Dialog onClose={onClose} open={isOpen} className='fixed inset-0 z-30'>
      <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
        <DialogBackdrop className='fixed inset-0 bg-black/30' />
        <DialogPanel className='border-ic-gray-100 bg-ic-white text-ic-black z-50 mx-0 my-4 max-h-[50%] min-w-72 max-w-4xl rounded-xl border-2 p-0 dark:bg-[#1C2C2E]'>
          <h4 className='px-6 py-4 text-xl font-semibold'>Select a Safe</h4>
          <div className='px-2 py-4'>
            {safes.map((safe) => (
              <div
                key={safe}
                className='text-ic-black dark:text-ic-white h-15 hover:bg-ic-gray-100 dark:hover:bg-ic-gray-900 my-1 flex cursor-pointer items-center justify-between px-4 py-2 text-sm font-medium'
                onClick={() => handleSafeClick(safe)}
              >
                {shortenAddress(safe)}
              </div>
            ))}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
