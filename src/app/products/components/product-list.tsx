'use client'

import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { ProductColHeader } from '@/app/products/components/product-col-header'
import { ProductRowItem } from '@/app/products/components/product-row-item'
import { productTokens } from '@/app/products/constants/tokens'
import { ProductRow } from '@/app/products/types/product'
import { SortBy, SortDirection } from '@/app/products/types/sort'
import { fetchAnalytics, fetchApy } from '@/app/products/utils/api'
import { sortProducts } from '@/app/products/utils/sort'
import { formatWei } from '@/lib/utils'

const THIRTY_SECONDS_IN_MS = 30 * 1000

export function ProductList() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const sortBy = searchParams.get('sort')
  const sortDirection = searchParams.get('dir') ?? SortDirection.DESC

  const {data: products, isFetching} = useQuery({
    initialData: [[], []] as [any[], any[]],
    queryKey: ['product-list'],
    queryFn: async () => {
      const analyticsPromises = Promise.all(
        productTokens.map((token) =>
          // TODO: https://github.com/IndexCoop/analytics-sdk/issues/30
          token.address ? fetchAnalytics(token.address) : null,
        ),
      )
      const apyPromises = Promise.all(
        productTokens.map((token) =>
          token.hasApy && token.symbol ? fetchApy(token.symbol) : null,
        ),
      )

      return Promise.all([analyticsPromises, apyPromises])
    },
    select: (data) => {
      const [analyticsResults, apyResults] = data

      return sortProducts(productTokens.map((token, idx) => ({
        ...token,
        price: analyticsResults[idx]?.navPrice,
        delta: analyticsResults[idx]?.change24h,
        tvl: analyticsResults[idx]?.marketCap,
        apy:
          apyResults[idx]?.apy !== undefined && apyResults[idx].apy !== '0'
            ? Number(formatWei(apyResults[idx].apy))
            : null,
      })) as ProductRow[], sortBy ?? 'tvl', sortDirection)
    },
    refetchInterval: THIRTY_SECONDS_IN_MS,
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
    <div className='bg-ic-white border-ic-gray-100 mt-8 w-full overflow-auto rounded-3xl border py-4 shadow-sm'>
      <div className='hidden justify-between py-6 md:flex'>
        <ProductColHeader
          className='!min-w-[400px] max-w-[460px] pl-[62px] !text-left'
          onClick={() => handleSortClick(SortBy.Product)}
          sortDirection={sortBy === SortBy.Product ? sortDirection : null}
        >
          Product
        </ProductColHeader>
        <ProductColHeader
          onClick={() => handleSortClick(SortBy.Type)}
          sortDirection={sortBy === SortBy.Type ? sortDirection : null}
        >
          Type
        </ProductColHeader>
        <ProductColHeader
          onClick={() => handleSortClick(SortBy.Theme)}
          sortDirection={sortBy === SortBy.Theme ? sortDirection : null}
        >
          Theme
        </ProductColHeader>
        <ProductColHeader
          className='!min-w-[130px] !text-right'
          onClick={() => handleSortClick(SortBy.Price)}
          sortDirection={sortBy === SortBy.Price ? sortDirection : null}
        >
          Current Price
        </ProductColHeader>
        <ProductColHeader
          className='!text-right'
          onClick={() => handleSortClick(SortBy.Delta)}
          sortDirection={sortBy === SortBy.Delta ? sortDirection : null}
        >
          24h
        </ProductColHeader>
        <ProductColHeader
          onClick={() => handleSortClick(SortBy.APY)}
          sortDirection={sortBy === SortBy.APY ? sortDirection : null}
        >
          APY
        </ProductColHeader>
        <ProductColHeader
          className='pr-8 !text-right'
          onClick={() => handleSortClick(SortBy.TVL)}
          sortDirection={sortBy === SortBy.TVL ? sortDirection : null}
        >
          TVL
        </ProductColHeader>
      </div>
      <div className='divide-ic-gray-200 flex flex-col divide-y md:divide-y-0'>
        {products.map((product) => (
          <ProductRowItem
            key={product.symbol}
            isLoading={isFetching}
            product={product}
          />
        ))}
      </div>
    </div>
  )
}
