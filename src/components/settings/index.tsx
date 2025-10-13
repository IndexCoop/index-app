import { Input, Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { Cog8ToothIcon } from '@heroicons/react/20/solid'
import { useMemo, useRef, useState } from 'react'

import { Toggle, ToggleState } from '@/components/toggle'
import { cn } from '@/lib/utils/tailwind'

import { Warning } from './warning'

type SettingsProps = {
  isAuto: boolean
  isDarkMode: boolean
  onChangeSlippage: (slippage: number) => void
  onClickAuto: () => void
  slippage: number
}

export const Settings = (props: SettingsProps) => {
  const { isAuto, slippage, onChangeSlippage, onClickAuto } = props
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [inputValue, setInputValue] = useState<string>('')

  const lowSlippage = useMemo(() => slippage < 0.05, [slippage])

  const showWarning = useMemo(
    () => slippage < 0.05 || (slippage > 1.0 && slippage <= 50),
    [slippage],
  )

  const toggleState = useMemo(
    () => (isAuto ? ToggleState.auto : ToggleState.custom),
    [isAuto],
  )

  const onChangeInput = (value: string) => {
    setInputValue(value)
    const updatedSlippage = parseFloat(value)
    if (value === '') {
      onClickAuto()
      return
    }
    if (Number.isNaN(updatedSlippage)) return
    onChangeSlippage(updatedSlippage)
  }

  const onClickToggle = (toggleState: ToggleState) => {
    if (toggleState === ToggleState.auto) {
      setInputValue('')
      onClickAuto()
      return
    }
    if (!inputRef.current) return
    // Focus input field and set slippage to adjust toggle state
    inputRef.current.focus()
    onChangeSlippage(slippage)
  }

  return (
    <Popover>
      <PopoverButton aria-label='Trade Settings' className='outline-none'>
        <Cog8ToothIcon className='dark:text-ic-gray-400 text-ic-black size-4' />
      </PopoverButton>
      <PopoverPanel
        anchor='bottom end'
        className='border-ic-gray-100 bg-ic-white z-10 w-[320px] rounded-3xl border p-4 shadow-inner'
      >
        <>
          <p className='text-ic-gray-600 text-base font-medium'>Max Slippage</p>
          <div className='my-4 flex items-center'>
            <Toggle
              toggleState={toggleState}
              labelLeft='Auto'
              labelRight='Custom'
              isDisabled={false}
              onClick={onClickToggle}
            />
            <div className='border-ic-gray-100 ml-2.5 flex h-[50px] items-center rounded-xl border px-2'>
              <Input
                className={cn(
                  'placeholder:text-ic-gray-400 bg-ic-white w-full p-2 pr-1 text-right text-sm font-medium outline-none',
                  parseFloat(inputValue) > 50
                    ? 'text-ic-red'
                    : 'text-ic-gray-900',
                )}
                placeholder={`${slippage}`}
                ref={inputRef}
                type='number'
                value={inputValue}
                onChange={(event) => {
                  const value = event.target.value
                  onChangeInput(value)
                }}
              />
              <p className='text-ic-gray-900 text-sm font-medium'>%</p>
            </div>
          </div>
          {showWarning && <Warning lowSlippage={lowSlippage} />}
        </>
      </PopoverPanel>
    </Popover>
  )
}
