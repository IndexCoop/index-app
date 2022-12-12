import { useColorStyles, useICColorMode } from 'styles/colors'

import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
} from '@chakra-ui/react'

import { PriceChangeIntervals, ProductsTableProduct } from '../'

import PerformanceCell from './PerformanceCell'
import TickerCell from './TickerCell'

type ProductsTableProps = {
  products: ProductsTableProduct[]
}

const ProductsTable = ({ products }: ProductsTableProps) => {
  const { isDarkMode } = useICColorMode()
  const { styles } = useColorStyles()
  const isMobile = useBreakpointValue({ base: true, md: false, lg: false })

  const colorScheme = isDarkMode ? 'whiteAlpha' : 'blackAlpha'
  const amountOfIntervalsToShow = isMobile ? 2 : PriceChangeIntervals.length
  const priceChangeIntervals = PriceChangeIntervals.slice(
    0,
    amountOfIntervalsToShow
  )

  return (
    <Table colorScheme={colorScheme}>
      <Thead>
        <Tr>
          <Th p={['8px 8px', '12px 24px']}>Ticker</Th>
          {priceChangeIntervals.map((interval) => (
            <Th key={interval[0]} p={['8px 8px', '12px 24px']}>
              {interval[0]}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {products.map((product) => (
          <Tr key={product.symbol}>
            <Td borderColor={styles.border} p={['16px 8px', '16px 24px']}>
              <TickerCell product={product} />
            </Td>
            {priceChangeIntervals.map((interval) => (
              <Td
                borderColor={styles.border}
                key={interval[0]}
                p={['16px 8px', '16px 24px']}
              >
                <PerformanceCell
                  percentChange={product.performance?.[interval[0]]}
                />
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

export default ProductsTable
