'use client'

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'

interface LeverageOnboardingPopupProps {
  isOpen: boolean
  onClose: () => void
  onGetStarted: () => void
}

export function LeverageOnboardingPopup({
  isOpen,
  onClose,
  onGetStarted,
}: LeverageOnboardingPopupProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-10'>
      <DialogBackdrop className='fixed inset-0 bg-black/60 backdrop-blur-sm' />

      <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
        <DialogPanel className='w-full max-w-[480px] rounded-2xl bg-[#1C1C1E] p-6 text-white'>
          <div className='space-y-6'>
            <h2 className='text-center text-2xl font-bold'>
              Leverage without Liquidations
            </h2>

            <p className='text-center text-gray-300'>
              Amplify your crypto exposure with automated rebalancing and
              built-in liquidation protection.
            </p>

            <div className='space-y-8'>
              <div className='space-y-2'>
                <h3 className='font-semibold'>
                  <span className='text-[#6366F1]'>1.</span> Set up your trade
                </h3>
                <p className='text-sm text-gray-400'>
                  Select your market, target leverage and input amount.
                </p>
                <div className='hidden md:block'>
                  {/* Trading interface preview image would go here */}
                </div>
              </div>

              <div className='space-y-2'>
                <h3 className='font-semibold'>
                  <span className='text-[#6366F1]'>2.</span> Under the hood
                </h3>
                <p className='text-sm text-gray-400'>
                  When you use an Index Coop product, Index automatically
                  creates a leveraged position using collateral and debt
                  positions on a DeFi lending market. Liquidation protection and
                  low costs gives your trade time to win.
                </p>
                <div className='hidden md:block'>
                  {/* Under the hood illustration would go here */}
                </div>
              </div>

              <div className='space-y-2'>
                <h3 className='font-semibold'>
                  <span className='text-[#6366F1]'>3.</span> Monitor your
                  positions
                </h3>
                <p className='text-sm text-gray-400'>
                  Check the &apos;Your Positions&apos; widget to monitor your
                  profits and losses, and keep track of your actions in the
                  history tab.
                </p>
                <div className='hidden md:block'>
                  {/* Positions monitoring interface preview would go here */}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className='space-y-4 pt-4'>
              <button
                onClick={onGetStarted}
                className='w-full rounded-lg bg-[#6366F1] px-4 py-3 font-semibold transition-colors hover:bg-[#5558E6]'
              >
                Get Started
              </button>
              <button
                onClick={onClose}
                className='w-full px-4 py-3 text-sm text-gray-400 transition-colors hover:text-gray-300'
              >
                Skip for now
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
