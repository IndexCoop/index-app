import { Tab, TabGroup, TabList } from '@headlessui/react'
import { isLeverageToken } from '@indexcoop/tokenlists'
import { useQuery } from '@tanstack/react-query'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useCallback, useMemo, useState } from 'react'

import {
  historyColumns,
  openPositionsColumns,
} from '@/app/leverage/components/portfolio-widget/columns'
import {
  TableRenderer,
  type Stats,
} from '@/app/leverage/components/portfolio-widget/table'
import { useLeverageToken } from '@/app/leverage/provider'
import { EnrichedToken } from '@/app/leverage/types'
import { fetchLeverageTokenPrices } from '@/app/leverage/utils/fetch-leverage-token-prices'
import { getLeverageType } from '@/app/leverage/utils/get-leverage-type'
import { ETH } from '@/constants/tokens'
import { GetApiV2UserAddressPositions200 } from '@/gen'
import { useNetwork } from '@/lib/hooks/use-network'
import { useQueryParams } from '@/lib/hooks/use-query-params'
import { useWallet } from '@/lib/hooks/use-wallet'

const OpenPositions = () => {
  const { address } = useWallet()
  const { chainId } = useNetwork()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { queryParams, updateQueryParams } = useQueryParams()

  const { balances } = useLeverageToken()

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
    queryKey: ['leverage-token-prices', chainId, balances.toString()],
    enabled: Boolean(chainId),
    queryFn: async () => {
      if (chainId) {
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
    queryFn: async () => {
      const response = await fetch('/api/leverage/history', {
        method: 'POST',
        body: JSON.stringify({
          user: address,
          chainId,
        }),
      })

      const data = (await response.json()) as {
        open: GetApiV2UserAddressPositions200
        history: GetApiV2UserAddressPositions200
        stats: Stats
      }

      return data
    },
  })

  const tableData = useMemo(
    () => (selectedIndex === 0 ? data.open : data.history),
    [data, selectedIndex],
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
      stats: data.stats,
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
        <Tab className='data-[selected]:text-ic-gray-50 outline-none'>
          Open Positions
        </Tab>
        <Tab className='data-[selected]:text-ic-gray-50 outline-none'>
          History
        </Tab>
      </TabList>
      <TableRenderer
        table={table}
        isFetching={isFetching}
        emptyText={
          selectedIndex === 0
            ? 'You are currently not holding any leverage suite tokens on this network.'
            : 'You have not executed any transactions with leverage tokens on this network yet.'
        }
      />
    </TabGroup>
  )
}

export default OpenPositions
