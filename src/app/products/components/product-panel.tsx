'use client'

import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

import { ProductList } from '@/app/products/components/product-list'
import { productTokens } from '@/app/products/constants/tokens'
import { ProductRow } from '@/app/products/types/product'
import { SortBy, SortDirection } from '@/app/products/types/sort'
import { sortProducts } from '@/app/products/utils/sort'
import { fetchTokenMetrics } from '@/lib/utils/api/index-data-provider'

export function ProductPanel() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const sortBy = searchParams.get('sort') as SortBy | null
  const sortDirection = (searchParams.get('dir') ??
    SortDirection.DESC) as SortDirection

  const { data: products, isFetching } = useQuery({
    gcTime: 5 * 60 * 1000, // 5 mins
    refetchOnWindowFocus: false,
    initialData: [] as any[],
    queryKey: ['product-list', sortBy, sortDirection],
    queryFn: async () => {
      return Promise.all(
        productTokens.map((token) =>
          token.address
            ? fetchTokenMetrics({
                tokenAddress: token.address,
                metrics: [
                  'nav',
                  'pav',
                  'navchange',
                  ...(token.hasApy ? (['apy'] as const) : []),
                ],
              })
            : null,
        ),
      )
    },
    select: (data) => {
      return sortProducts(
        productTokens.map((token, idx) => ({
          ...token,
          price: data[idx]?.NetAssetValue,
          delta:
            typeof data[idx]?.NavChange24Hr === 'number'
              ? data[idx].NavChange24Hr * 100
              : undefined,
          tvl: data[idx]?.ProductAssetValue,
          apy: data[idx]?.APY,
        })) as ProductRow[],
        sortBy ?? 'tvl',
        sortDirection,
      )
    },
  })

  const handleSortClick = (clickedSortBy: string) => {
    if (isFetching) return
    if (sortBy === null || sortBy !== clickedSortBy) {
      return router.push(
        `${pathname}?${new URLSearchParams({
          sort: clickedSortBy,
        }).toString()}`,
        {
          scroll: false,
        },
      )
    }

    // User clicked the current active filter
    const newSortDirection =
      sortDirection === SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC
    router.push(
      `${pathname}?${new URLSearchParams({
        sort: searchParams.get('sort') as string,
        dir: newSortDirection,
      }).toString()}`,
      {
        scroll: false,
      },
    )
  }

  return (
    <div className='mx-auto my-12 flex max-w-screen-2xl flex-col gap-8 md:gap-12'>
      <Suspense>
        <ProductList
          isFetching={isFetching}
          products={products}
          onSortClick={handleSortClick}
          sortBy={sortBy}
          sortDirection={sortDirection}
          listType='Earn'
        />
        <ProductList
          isFetching={isFetching}
          hideApyColumn
          products={products}
          onSortClick={handleSortClick}
          sortBy={sortBy}
          sortDirection={sortDirection}
          listType='Leverage'
        />
        <ProductList
          isFetching={isFetching}
          hideApyColumn
          products={products}
          onSortClick={handleSortClick}
          sortBy={sortBy}
          sortDirection={sortDirection}
          listType='Strategies'
        />
      </Suspense>
    </div>
  )
}
