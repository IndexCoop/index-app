import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'

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
    <Dialog open={isOpen} onClose={onClose} className='relative z-20'>
      <DialogBackdrop className='fixed inset-0 bg-black/30' />

      <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
        <DialogPanel className='h-[500px] max-w-4xl bg-transparent shadow-none'>
          <div className='flex h-full'>
            <div className='align-center max-h-4xl mx-auto my-auto flex max-w-4xl flex-row items-start gap-3'>
              <PrtWidget token={token} onClose={onClose} />
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
