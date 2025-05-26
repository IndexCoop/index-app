'use client'

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import Image from 'next/image'

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
        <DialogPanel className='w-full max-w-[480px] rounded-3xl border border-[rgba(255,255,255,0.1)] bg-zinc-900 p-6 pb-3 text-neutral-50 shadow-[0px_20px_40px_0px_rgba(0,0,0,0.10),1px_1px_4.4px_0px_rgba(255,255,255,0.06)_inset]'>
          <div className='space-y-6'>
            <div className='flex-col space-y-6'>
              <h2 className='text-1xl font-semibold'>
                Leverage without Liquidations
              </h2>
              <p className='text-ic-gray-200 text-sm'>
                Amplify your crypto exposure with automated rebalancing and
                built-in liquidation protection.
              </p>
            </div>
            <div className='space-y-8'>
              <div className='flex items-center justify-between'>
                <p className='text-xs font-medium text-gray-400'>
                  <span className='text-neutral-50'>1. Set up your trade</span>-
                  Select your market, target leverage and input amount.
                </p>
                <div className='hidden md:block'>
                  <Image
                    src='/assets/onboarding-setup-trade.png'
                    alt='Setup your trade interface'
                    width={170}
                    height={86}
                    className='rounded-[4px]'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <h3 className='font-semibold'>
                  <span className='text-[#6366F1]'>2.</span> Under the hood
                </h3>
                <p className='flex text-sm text-gray-400'>
                  When you use an Index Coop product, Index automatically
                  creates a leveraged position using collateral and debt
                  positions on a DeFi lending market. Liquidation protection and
                  low costs gives your trade time to win.
                </p>
                <div className='hidden md:block'>
                  <Image
                    src='/assets/onboarding-under-the-hood.png'
                    alt='Under the hood illustration'
                    width={400}
                    height={225}
                    className='w-full rounded-lg'
                  />
                </div>
              </div>

              <div className='flex space-y-2'>
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
                  <Image
                    src='/assets/onboarding-monitor-your-positions.png'
                    alt='Positions monitoring interface'
                    width={400}
                    height={225}
                    className='w-full rounded-lg'
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div>
              <button
                onClick={onGetStarted}
                className='w-full rounded-full bg-[#252628] px-6 py-4 font-semibold text-neutral-400 transition-colors hover:bg-[#252628]'
              >
                Get Started
              </button>
              <button
                onClick={onClose}
                className='h-5 w-full px-6 text-xs font-medium text-neutral-600 underline transition-colors hover:text-gray-300'
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
