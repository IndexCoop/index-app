import { Tab, TabGroup, TabList } from '@headlessui/react'
import { isLeverageToken } from '@indexcoop/tokenlists'
import { useQuery } from '@tanstack/react-query'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useSetAtom } from 'jotai'
import { useCallback, useMemo, useState } from 'react'

import {
  historyColumns,
  openPositionsColumns,
} from '@/app/leverage/components/portfolio-widget/columns'
import { TableRenderer } from '@/app/leverage/components/portfolio-widget/table'
import { useLeverageToken } from '@/app/leverage/provider'
import { EnrichedToken } from '@/app/leverage/types'
import { fetchLeverageTokenPrices } from '@/app/leverage/utils/fetch-leverage-token-prices'
import { getLeverageType } from '@/app/leverage/utils/get-leverage-type'
import { fetchPositionsAtom } from '@/app/store/positions-atom'
import { ETH } from '@/constants/tokens'
import { useNetwork } from '@/lib/hooks/use-network'
import { useQueryParams } from '@/lib/hooks/use-query-params'
import { useWallet } from '@/lib/hooks/use-wallet'
import { cn } from '@/lib/utils/tailwind'

const OpenPositions = () => {
  const { address, isConnected } = useWallet()
  const { chainId } = useNetwork()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { queryParams, updateQueryParams } = useQueryParams()
  const fetchPositions = useSetAtom(fetchPositionsAtom)

  const { balances, reset } = useLeverageToken()

  const adjustPosition = useCallback(
    (isMinting: boolean, token: EnrichedToken) => {
      if (!isLeverageToken(token)) return

      updateQueryParams({
        isMinting,
        ...(isMinting
          ? { outputToken: token, inputToken: ETH }
          : { inputToken: token, outputToken: ETH }),
        leverageType: getLeverageType(token) ?? undefined,
        network: queryParams.queryNetwork,
      })

      const scrollDiv = document.getElementById('close-position-scroll')
      if (scrollDiv) {
        window.scrollTo({
          top: scrollDiv.getBoundingClientRect().top + window.scrollY - 90,
          behavior: 'smooth',
        })
      }
    },
    [queryParams, updateQueryParams],
  )

  const { data: tokens } = useQuery({
    initialData: [],
    queryKey: ['leverage-token-prices', address, chainId, balances.toString()],
    enabled: Boolean(address),

    queryFn: async () => {
      if (chainId) {
        reset()
        return fetchLeverageTokenPrices(balances, chainId)
      }

      return []
    },

    select: (data) =>
      data?.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.address!]: curr,
        }),
        {} as Record<string, EnrichedToken>,
      ),
  })

  const { data, isFetching } = useQuery({
    initialData: { open: [], history: [], stats: {} },
    enabled: Boolean(address && chainId),
    queryKey: ['leverage-token-history', address, chainId, selectedIndex],
    queryFn: () => fetchPositions(address ?? '', chainId ?? 0),
  })

  const tableData = useMemo(
    () =>
      selectedIndex === 0
        ? (data.open ?? []).filter((p) => {
            const balance = balances.find(
              (b) => b.token === p.metrics?.tokenAddress,
            )

            return (balance?.value ?? 0) > 0
          })
        : data.history,
    [data, balances, selectedIndex],
  )

  const table = useReactTable({
    columns: selectedIndex === 0 ? openPositionsColumns : historyColumns,
    data: tableData,
    meta: {
      user: address ?? '',
      history: data.history,
      transfers: (data.history ?? []).filter(
        (row) => !row.trade && !row.metrics,
      ),
      tokens: tokens as Record<string, EnrichedToken>,
      stats: data.stats ?? {},
      adjustPosition,
    },
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <TabGroup
      className='flex flex-col gap-6'
      selectedIndex={selectedIndex}
      onChange={setSelectedIndex}
    >
      <TabList className='text-ic-gray-600 flex gap-6 text-sm font-bold'>
        <Tab className='data-[selected]:text-ic-gray-50 flex items-center gap-2 outline-none'>
          Open Positions
          <span
            className={cn(
              'text-ic-gray-300 flex h-3.5 items-center justify-center rounded-[4px] bg-purple-500/30 px-1.5 py-0.5 text-[8px]',
              selectedIndex === 0 && 'text-ic-white bg-purple-500',
            )}
          >
            BETA
          </span>
        </Tab>
        <Tab className='data-[selected]:text-ic-gray-50 flex items-center gap-2 outline-none'>
          History
          <span
            className={cn(
              'text-ic-gray-300 flex h-3.5 items-center justify-center rounded-[4px] bg-purple-500/30 px-1.5 py-0.5 text-[8px]',
              selectedIndex === 1 && 'text-ic-white bg-purple-500',
            )}
          >
            BETA
          </span>
        </Tab>
      </TabList>
      <TableRenderer
        table={table}
        isFetching={isFetching}
        emptyText={
          !isConnected
            ? 'Please connect your wallet to view your positions.'
            : selectedIndex === 0
              ? 'You are currently not holding any leverage suite tokens on this network.'
              : 'You have not executed any transactions with leverage tokens on this network yet.'
        }
      />
    </TabGroup>
  )
}

export default OpenPositions
