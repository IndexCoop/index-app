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

export const ProductsFilter = () => {
  const filters = Object.values(ProductFilter)
  console.log(filters)
  return (
    <Flex>
      {filters.map((filter, index) => (
        <FilterButton key={index} filter={filter} isActive={index === 0} />
      ))}
    </Flex>
  )
}

type FilterButtonProps = {
  filter: ProductFilter
  isActive: boolean
}

const FilterButton = ({ filter, isActive }: FilterButtonProps) => {
  const label = labelForFilter(filter)
  return (
    <Button
      mr={['0', '2']}
      // onClick={() => onOpen()}
      // w={['100%', 'inherit']}
      variant={isActive ? 'highlightSelected' : 'highlight'}
    >
      {label}
    </Button>
  )
}
