import { Button, Flex } from '@chakra-ui/react'

export enum ProductFilter {
  all = 'all',
  thematic = 'thematic',
  leverage = 'leverage',
  yield = 'yield',
}

const labelForFilter = (filter: ProductFilter) => {
  switch (filter) {
    case ProductFilter.all:
      return 'All'
    case ProductFilter.leverage:
      return 'Leverage'
    case ProductFilter.thematic:
      return 'Thematic'
    case ProductFilter.yield:
      return 'Yield'
  }
}

type ProductsFilterProps = {
  onSelectFilter: (filter: ProductFilter) => void
  selected: ProductFilter
}

export const ProductsFilter = (props: ProductsFilterProps) => {
  const { onSelectFilter, selected } = props
  const filters = Object.values(ProductFilter)
  console.log(filters)
  return (
    <Flex ml='0' my='32px'>
      {filters.map((filter, index) => (
        <FilterButton
          key={index}
          filter={filter}
          onSelect={onSelectFilter}
          isActive={filter === selected}
        />
      ))}
    </Flex>
  )
}

type FilterButtonProps = {
  filter: ProductFilter
  onSelect: (filter: ProductFilter) => void
  isActive: boolean
}

const FilterButton = (props: FilterButtonProps) => {
  const { filter, onSelect, isActive } = props
  const label = labelForFilter(filter)
  return (
    <Button
      mr={['0', '2']}
      onClick={() => onSelect(filter)}
      variant={isActive ? 'highlightSelected' : 'highlight'}
    >
      {label}
    </Button>
  )
}
