import { Tab, TabGroup, TabList } from '@headlessui/react'
import { isLeverageToken } from '@indexcoop/tokenlists'
import { useQuery } from '@tanstack/react-query'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useCallback, useState } from 'react'

import { EnrichedToken } from '@/app/earn/types'
import {
  historyColumns,
  openPositionsColumns,
} from '@/app/leverage/components/portfolio-widget/columns'
import { TableRenderer } from '@/app/leverage/components/portfolio-widget/table'
import { useLeverageToken } from '@/app/leverage/provider'
import { fetchLeverageTokenPrices } from '@/app/leverage/utils/fetch-leverage-token-prices'
import { getLeverageBaseToken } from '@/app/leverage/utils/get-leverage-base-token'
import { getLeverageType } from '@/app/leverage/utils/get-leverage-type'
import { GetApiV2UserAddressPositions200 } from '@/gen'
import { useNetwork } from '@/lib/hooks/use-network'
import { useWallet } from '@/lib/hooks/use-wallet'

const OpenPositions = () => {
  const { address } = useWallet()
  const { chainId } = useNetwork()
  const [selectedIndex, setSelectedIndex] = useState(0)

  const { balances, setIsMinting, onSelectBaseToken, onSelectLeverageType } =
    useLeverageToken()

  const adjustPosition = useCallback(
    (mint: boolean, token: EnrichedToken) => {
      setIsMinting(mint)

      const leverageBaseToken = getLeverageBaseToken(token.symbol)
      if (leverageBaseToken === null) return
      onSelectBaseToken(leverageBaseToken.symbol)

      if (!isLeverageToken(token)) return

      const leverageType = getLeverageType(token)
      if (leverageType === null) return
      onSelectLeverageType(leverageType)

      const scrollDiv = document.getElementById('close-position-scroll')
      if (scrollDiv) {
        window.scrollTo({
          top: scrollDiv.getBoundingClientRect().top + window.scrollY - 90,
          behavior: 'smooth',
        })
      }
    },
    [onSelectBaseToken, onSelectLeverageType, setIsMinting],
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
    initialData: { open: [], history: [] },
    enabled: Boolean(address && chainId),
    queryKey: ['leverage-token-history', address, chainId, selectedIndex],
    queryFn: async () => {
      const response = await fetch('/api/leverage/history', {
        method: 'POST',
        body: JSON.stringify({ user: address, chainId }),
      })

      const data = (await response.json()) as {
        open: GetApiV2UserAddressPositions200
        history: GetApiV2UserAddressPositions200
      }

      return data
    },
    select: (data) => {
      return selectedIndex === 0
        ? data.open
        : data.history.sort(
            (a, b) =>
              new Date(b.metadata.blockTimestamp).getTime() -
              new Date(a.metadata.blockTimestamp).getTime(),
          )
    },
  })

  const table = useReactTable({
    columns: selectedIndex === 0 ? openPositionsColumns : historyColumns,
    data,
    meta: {
      tokens: tokens as Record<string, EnrichedToken>,
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
            ? 'You are currently not holding any Leverage Suite tokens.'
            : 'You have not executed any transactions with leverage tokens yet.'
        }
      />
    </TabGroup>
  )
}

export default OpenPositions
