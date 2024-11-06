import { Tooltip } from '@chakra-ui/react'
import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

import { LeverageType } from '@/app/yield/types'
import { colors } from '@/lib/styles/colors'

type FeesItemProps = {
  label: string
  showPositiveFee?: boolean
  percent: string
  tooltip?: string
  valueUsd: string
}

function FeesItem(props: FeesItemProps) {
  return (
    <div className='text-ic-gray-300 flex flex-row items-center justify-between text-xs'>
      <div className='font-medium'>
        {props.tooltip ? (
          <Tooltip
            className='bg-ic-dark'
            borderRadius='6px'
            fontSize='12px'
            fontWeight={500}
            label={props.tooltip}
            p='12px 16px'
            placement='bottom-start'
            textColor={colors.ic.gray[300]}
          >
            {props.label}
          </Tooltip>
        ) : (
          props.label
        )}
      </div>
      <div className='flex flex-row gap-1'>
        <div
          className={clsx(
            'font-bold',
            props.showPositiveFee ? 'text-ic-green' : 'text-ic-white',
          )}
        >{`${props.showPositiveFee ? '+' : ''}${props.percent}`}</div>
        <div className='font-normal'>{props.valueUsd}</div>
      </div>
    </div>
  )
}

type FeesProps = {
  leverageType: LeverageType
}

export function Fees(props: FeesProps) {
  return (
    <Disclosure as='div' className='rounded-xl border border-[#3A6060]'>
      {({ open }) => (
        <div className='p-4'>
          <dt>
            <Disclosure.Button className='text-ic-gray-300 flex w-full items-center justify-between text-left'>
              <span className='text-xs font-medium'>Costs and Fees</span>
              <div className='flex flex-row items-center gap-1'>
                <span className='flex items-center'>
                  {open ? (
                    <ChevronUpIcon className='h-6 w-6' aria-hidden='true' />
                  ) : (
                    <ChevronDownIcon className='h-6 w-6' aria-hidden='true' />
                  )}
                </span>
              </div>
            </Disclosure.Button>
          </dt>
          <Disclosure.Panel as='dd' className='mt-2 flex flex-col gap-2'>
            <FeesItem
              label='Streaming Fee'
              percent={
                props.leverageType === LeverageType.Long3x ? '5.48%' : '3.65%'
              }
              tooltip='An annual fee for product holders. This fee is charged at the smart contract level.'
              valueUsd={''}
            />
            <FeesItem label='Mint Fee' percent={'0.10%'} valueUsd={''} />
            <FeesItem label='Redeem Fee' percent={'0.10%'} valueUsd={''} />
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  )
}
