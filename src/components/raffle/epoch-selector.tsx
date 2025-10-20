'use client'

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

import type { GetApiV2RaffleEpochs200 } from '@/gen'
import { cn } from '@/lib/utils/tailwind'

type EpochWithName = GetApiV2RaffleEpochs200[number] & { name: string }

type EpochSelectorProps = {
  epochs: EpochWithName[]
  selectedEpoch: EpochWithName
  onEpochChange: (epoch: EpochWithName) => void
}

export function EpochSelector({
  epochs,
  selectedEpoch,
  onEpochChange,
}: EpochSelectorProps) {
  return (
    <Popover className='relative inline-block'>
      <PopoverButton
        className={cn(
          'text-ic-gray-300 flex items-center gap-2 rounded-sm bg-[#061010] px-4 py-2 text-xs transition',
          'hover:bg-zinc-600 focus:outline-none data-[active]:bg-zinc-600',
        )}
      >
        <span>{selectedEpoch.name}</span>
        <ChevronDownIcon className='size-5' />
      </PopoverButton>

      <PopoverPanel
        transition
        anchor='bottom'
        className='z-10 mt-2 min-w-[200px] rounded-sm bg-[#061010] shadow-[4px_4px_8px_0px_rgba(0,_0,_0,_0.90)] transition duration-200 ease-in-out data-[closed]:-translate-y-1 data-[closed]:opacity-0'
      >
        {({ close }) => (
          <div className='flex flex-col py-2'>
            {epochs.map((epoch) => (
              <button
                key={epoch.id}
                onClick={() => {
                  onEpochChange(epoch)
                  close()
                }}
                className={cn(
                  'px-4 py-2 text-left text-xs transition',
                  epoch.id === selectedEpoch.id
                    ? 'bg-ic-blue-300 font-semibold text-black'
                    : 'text-ic-gray-300 hover:bg-zinc-800',
                )}
              >
                {epoch.name}
              </button>
            ))}
          </div>
        )}
      </PopoverPanel>
    </Popover>
  )
}
