import { Tab, TabGroup, TabList } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'
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
import { getLeverageTokens } from '@/app/leverage/constants'
import { EnrichedToken } from '@/app/leverage/types'
import { fetchLeverageTokenPrices } from '@/app/leverage/utils/fetch-leverage-token-prices'
import { getLeverageType } from '@/app/leverage/utils/get-leverage-type'
import { fetchLeveragePositionsAtom } from '@/app/store/positions-atom'
import { ETH } from '@/constants/tokens'
import { useAnalytics } from '@/lib/hooks/use-analytics'
import { useBalances } from '@/lib/hooks/use-balance'
import { useNetwork } from '@/lib/hooks/use-network'
import { useQueryParams } from '@/lib/hooks/use-query-params'
import { useWallet } from '@/lib/hooks/use-wallet'
import { cn } from '@/lib/utils/tailwind'

const OpenPositions = () => {
  const { address, isConnected } = useWallet()
  const { chainId } = useNetwork()
  const [selectedIndex, setSelectedIndex] = useState<undefined | number>(
    undefined,
  )
  const { queryParams, updateQueryParams } = useQueryParams()
  const fetchPositions = useSetAtom(fetchLeveragePositionsAtom)
  const { logEvent } = useAnalytics()

  const indexTokenAddresses = useMemo(() => {
    if (chainId) {
      return getLeverageTokens(chainId).map((token) => token.address!)
    }

    return []
  }, [chainId])

  const { balances, forceRefetchBalances } = useBalances(
    address,
    indexTokenAddresses,
  )

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
    queryKey: ['leverage-token-prices', address, chainId],
    enabled: Boolean(address && chainId),

    queryFn: async () => {
      if (chainId) {
        const { data: balances = [] } = await forceRefetchBalances()

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
    <TabGroup className='flex flex-col gap-6' selectedIndex={selectedIndex}>
      <TabList className='flex gap-6 text-sm font-bold text-neutral-400'>
        <Tab
          className={cn(
            'flex items-center gap-1.5 outline-none',
            selectedIndex === 0 && 'text-neutral-50',
          )}
          onClick={() => {
            setSelectedIndex((idx) => (idx === 0 ? undefined : 0))
            logEvent('Open Positions Tab Clicked')
          }}
        >
          Open Positions
          <span
            className={cn(
              'flex h-3.5 items-center justify-center rounded-[4px] bg-purple-500/30 px-1.5 py-0.5 text-[8px] text-neutral-400',
              selectedIndex === 0 && 'bg-purple-500 text-neutral-50',
            )}
          >
            BETA
          </span>
          <ChevronUpIcon
            className={cn(
              'size-5',
              selectedIndex === 0 && 'rotate-180 transform transition',
            )}
          />
        </Tab>
        <Tab
          className={cn(
            'flex items-center gap-1.5 outline-none',
            selectedIndex === 1 && 'text-neutral-50',
          )}
          onClick={() => {
            setSelectedIndex((idx) => (idx === 1 ? undefined : 1))
            logEvent('History Tab Clicked')
          }}
        >
          History
          <span
            className={cn(
              'flex h-3.5 items-center justify-center rounded-[4px] bg-purple-500/30 px-1.5 py-0.5 text-[8px] text-neutral-400',
              selectedIndex === 1 && 'bg-purple-500 text-neutral-50',
            )}
          >
            BETA
          </span>
          <ChevronUpIcon
            className={cn(
              'size-5',
              selectedIndex === 1 && 'rotate-180 transform transition',
            )}
          />
        </Tab>
      </TabList>
      {typeof selectedIndex === 'number' && (
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
      )}
    </TabGroup>
  )
}

export default OpenPositions
