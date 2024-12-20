import { Button } from '@headlessui/react'
import ExternalLinkIcon from '@heroicons/react/24/outline/ArrowTopRightOnSquareIcon'
import {
  getTokenByChainAndAddress,
  isLeverageToken,
  LeverageType,
} from '@indexcoop/tokenlists'
import { createColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'
import * as chains from 'viem/chains'

import { GetApiV2UserAddressPositionsQueryResponse } from '@/gen'
import { cn } from '@/lib/utils/tailwind'


const columnsHelper =
  createColumnHelper<GetApiV2UserAddressPositionsQueryResponse[number]>()

const map: Record<LeverageType, string> = {
  Short1x: '-1x',
  Long2x: '2x',
  Long3x: '3x',
}

export const openPositionsColumns = [
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:open-positions.market',
    header: () => <div className='flex-1 text-left'>Market</div>,
    cell: (row) => {
      const data = row.getValue()
      return (
        <div className='flex flex-1 items-center gap-2 text-left'>
          <Image
            src={
              getTokenByChainAndAddress(
                data.metrics?.chainId,
                data.metrics?.tokenAddress,
              )?.logoURI ?? ''
            }
            width={16}
            height={16}
            alt=''
          />
          {`${data.trade?.underlyingAssetSymbol} / ${data.trade?.underlyingAssetUnitPriceDenominator}`}
        </div>
      )
    },
  }),
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:open-positions.strategy',
    header: () => <div className='flex-1 text-center'>Strategy</div>,
    cell: (row) => {
      const data = row.getValue()

      const token =
        row.table.options.meta?.tokens[data.metrics?.tokenAddress ?? '']

      if (isLeverageToken(token)) {
        return (
          <div className={cn('text-ic-blue-300 flex-1 text-center')}>
            {map[token.extensions.leverage.type]}
          </div>
        )
      }

      return <></>
    },
  }),
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:open-positions.netBalance',
    header: () => <div className='flex-1 text-left'>Net Balance</div>,
    cell: (row) => {
      const data = row.getValue()

      const token =
        row.table.options.meta?.tokens[data.metrics?.tokenAddress ?? '']

      if (!isLeverageToken(token)) return <></>

      return <div className='flex-1 text-left'>${token.usd?.toFixed(2)}</div>
    },
  }),
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:open-positions.unrealisedPnL',
    header: () => <div className='flex-1 text-right'>Unrealised PnL</div>,
    cell: (row) => {
      const data = row.getValue()

      const token =
        row.table.options.meta?.tokens[data.metrics?.tokenAddress ?? '']

      if (!isLeverageToken(token) || !data.trade || !data.metrics) return <></>

      const balance = token.usd ?? 0
      const cost = data.metrics.endingPositionCost ?? 0

      const pnl = balance - cost
      const pnlPercentage = (pnl / cost) * 100
      const sign = Math.sign(pnl)

      return (
        <div
          className={cn(
            'flex-1 text-right',
            sign === 1 && 'text-ic-blue-300',
            sign === -1 && 'text-red-500',
            sign === 0 && 'text-ic-white',
          )}
        >
          {`${sign === 1 ? '+' : sign === -1 ? '-' : ''} $${Math.abs(pnl).toFixed(2)} (${pnlPercentage.toFixed(2)}%)`}
        </div>
      )
    },
  }),
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:open-positions.entryPrice',
    header: () => <div className='flex-1 text-right'>Entry Price</div>,
    cell: (row) => {
      const data = row.getValue()
      return (
        <div className='flex-1 text-right'>
          ${data.metrics?.endingAvgCostPerUnit?.toFixed(2)}
        </div>
      )
    },
  }),
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:open-positions.currentPrice',
    header: () => <div className='flex-1 text-right'>Current Price</div>,
    cell: (row) => {
      const data = row.getValue()

      const token =
        row.table.options.meta?.tokens[data.metrics?.tokenAddress ?? '']

      if (isLeverageToken(token) && data.trade && data.metrics) {
        return (
          <div className='flex-1 text-right'>
            ${token.unitPriceUsd?.toFixed(2)}
          </div>
        )
      }

      return
    },
  }),
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:open-positions.increase',
    header: () => (
      <div className='flex flex-[2] items-center justify-end gap-4'>
        <div className='w-[50px] text-right'>Increase</div>
        <div className='w-[50px]'>Close</div>
      </div>
    ),
    cell: (row) => {
      const data = row.getValue()

      const token =
        row.table.options.meta?.tokens[data.metrics?.tokenAddress ?? '']

      if (!isLeverageToken(token)) return <></>

      return (
        <div className='flex flex-[2] items-center justify-end gap-4'>
          <div className='flex w-[50px] justify-end'>
            <Button
              className='hover:bg-ic-dark flex size-[25px] items-center justify-center rounded-lg border border-white'
              onClick={() =>
                row.table.options.meta?.adjustPosition(true, token)
              }
            >
              +
            </Button>
          </div>
          <div className='w-[50px]'>
            <Button
              className='hover:bg-ic-dark flex size-[25px] items-center justify-center rounded-lg border border-white'
              onClick={() =>
                row.table.options.meta?.adjustPosition(false, token)
              }
            >
              -
            </Button>
          </div>
        </div>
      )
    },
  }),
]

const getAction = (data: GetApiV2UserAddressPositionsQueryResponse[number]) => {
  if (!data.trade || !data.metrics) return 'Transfer'

  if (data.trade.transactionType === 'buy') {
    if (data.metrics.beginningUnits === 0) {
      return 'Open'
    } else {
      return 'Increase'
    }
  }

  if (data.trade.transactionType === 'sell' && data.metrics.endingUnits === 0) {
    return 'Close'
  }

  return 'Decrease'
}

export const historyColumns = [
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:history.market',
    header: () => <div className='flex-1 text-left'>Market</div>,
    cell: (row) => {
      const data = row.getValue()
      return (
        <div className='flex flex-1 items-center gap-2 text-left'>
          <Image
            src={
              getTokenByChainAndAddress(
                data.metrics?.chainId,
                data.metrics?.tokenAddress,
              )?.logoURI ?? ''
            }
            width={16}
            height={16}
            alt=''
          />
          {`${data.trade?.underlyingAssetSymbol} / ${data.trade?.underlyingAssetUnitPriceDenominator}`}
        </div>
      )
    },
  }),
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:history.strategy',
    header: () => <div className='flex-[0.75] text-center'>Strategy</div>,
    cell: (row) => {
      const data = row.getValue()

      const token =
        row.table.options.meta?.tokens[data.metrics?.tokenAddress ?? '']

      if (isLeverageToken(token)) {
        return (
          <div className={cn('text-ic-blue-300 flex-[0.75] text-center')}>
            {map[token.extensions.leverage.type]}
          </div>
        )
      }

      return <></>
    },
  }),
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:history.action',
    header: () => <div className='flex-[0.75] text-left'>Action</div>,
    cell: (row) => {
      const data = row.getValue()

      return <div className='flex-[0.75] text-left'>{getAction(data)}</div>
    },
  }),
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:history.value',
    header: () => <div className='flex-1 text-right'>Value</div>,
    cell: (row) => {
      const data = row.getValue()

      if (data.trade) {
        const value =
          data.trade.transactionType === 'buy'
            ? data.trade.inputTokenAmountUsd
            : data.trade.outputTokenAmountUsd

        return (
          <div className='text-ic-blue-300 flex-1 text-right'>
            ${value.toFixed(2)}
          </div>
        )
      }

      return <></>
    },
  }),
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:history.price',
    header: () => <div className='flex-1 text-right'>Price</div>,
    cell: (row) => {
      const data = row.getValue()

      return (
        <div className='flex-1 text-right'>
          ${data.trade?.underlyingAssetUnitPrice?.toFixed(2)}
        </div>
      )
    },
  }),
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:history.realisedPnL',
    header: () => <div className='flex-1 text-right'>Realised PnL</div>,
    cell: (row) => {
      const data = row.getValue()

      const token =
        row.table.options.meta?.tokens[data.metrics?.tokenAddress ?? '']

      if (
        isLeverageToken(token) &&
        data.metrics &&
        data.trade?.transactionType === 'sell'
      ) {
        const _return = data.metrics.totalReturnOfUnitsSold ?? 0
        const cost = data.metrics.totalCostOfUnitsSold ?? 0

        const pnl = data.metrics.endingPnL ?? 0
        const pnlPercentage = ((_return - cost) / cost) * 100
        const sign = Math.sign(pnl)

        return (
          <div
            className={cn(
              'flex-1 text-right',
              sign === 1 && 'text-ic-blue-300',
              sign === -1 && 'text-red-500',
              sign === 0 && 'text-ic-white',
            )}
          >
            {`${sign === 1 ? '+' : sign === -1 ? '-' : ''} $${Math.abs(pnl).toFixed(2)} (${pnlPercentage.toFixed(2)}%)`}
          </div>
        )
      }

      return <div className='flex-1 text-right'>-</div>
    },
  }),
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:history.time',
    header: () => <div className='ml-4 flex-1 text-left'>Time</div>,
    cell: (row) => {
      const data = row.getValue()

      return (
        <div className='ml-4 flex-1 text-left'>
          {new Date(data.trade?.createdAt ?? '').toLocaleDateString()}
        </div>
      )
    },
  }),
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:history.blockExplorer',
    header: () => <div className='flex-[0.25]' />,
    cell: (row) => {
      const data = row.getValue()

      const chain = Object.values(chains).find(
        (chain) => chain.id === data.trade?.chainId,
      )

      return (
        <Button
          className='flex flex-[0.25] justify-end'
          as='a'
          target='_blank'
          href={`${chain?.blockExplorers?.default.url}/tx/${data.hash}`}
        >
          <ExternalLinkIcon className='h-6 w-6' />
        </Button>
      )
    },
  }),
]
