'use client'

import { useMemo } from 'react'

import { ProductColHeader } from '@/app/products/components/product-col-header'
import { ProductRowItem } from '@/app/products/components/product-row-item'
import { ProductListType, ProductRow } from '@/app/products/types/product'
import { SortBy, SortDirection } from '@/app/products/types/sort'

type Props = {
  isFetching: boolean
  hideApyColumn?: boolean
  onSortClick: (sortBy: SortBy) => void
  products: ProductRow[]
  sortBy: SortBy | null
  sortDirection: SortDirection
  listType: ProductListType
}

export function ProductList({
  isFetching,
  hideApyColumn = false,
  products,
  onSortClick,
  sortBy,
  sortDirection,
  listType,
}: Props) {
  const filteredProducts = useMemo(() => {
    return products.filter((product) => product.listType === listType)
  }, [listType, products])
  return (
    <div>
      <div className='text-ic-gray-950 pb-3 font-semibold md:pb-5'>
        {listType}
      </div>
      <div className='bg-ic-white border-ic-gray-100 w-full overflow-auto rounded-md border py-4 shadow-sm'>
        <div className='hidden justify-between py-6 md:flex'>
          <ProductColHeader
            className='!min-w-[400px] max-w-[460px] pl-[62px] !text-left'
            onClick={() => onSortClick(SortBy.Product)}
            sortDirection={sortBy === SortBy.Product ? sortDirection : null}
          >
            Product
          </ProductColHeader>
          <ProductColHeader
            className='!min-w-[130px] !text-right'
            onClick={() => onSortClick(SortBy.Price)}
            sortDirection={sortBy === SortBy.Price ? sortDirection : null}
          >
            Current Price
          </ProductColHeader>
          <ProductColHeader
            className='!text-right'
            onClick={() => onSortClick(SortBy.Delta)}
            sortDirection={sortBy === SortBy.Delta ? sortDirection : null}
          >
            24h
          </ProductColHeader>
          {!hideApyColumn && (
            <ProductColHeader
              onClick={() => onSortClick(SortBy.APY)}
              sortDirection={sortBy === SortBy.APY ? sortDirection : null}
            >
              APY
            </ProductColHeader>
          )}
          <ProductColHeader
            className='pr-8 !text-right'
            onClick={() => onSortClick(SortBy.TVL)}
            sortDirection={sortBy === SortBy.TVL ? sortDirection : null}
          >
            TVL
          </ProductColHeader>
        </div>
        <div className='divide-ic-gray-200 flex flex-col divide-y md:divide-y-0'>
          {filteredProducts.map((product) => (
            <ProductRowItem
              key={product.symbol}
              hideApyColumn={hideApyColumn}
              isLoading={isFetching}
              product={product}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
