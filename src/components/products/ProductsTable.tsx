import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'

import PerformanceCell from 'components/products/PerformanceCell'
import TickerCell from 'components/products/TickerCell'
import {
  PriceChangeIntervals,
  ProductsTableProduct,
} from 'components/views/Products'

type ProductsTableProps = {
  products: ProductsTableProduct[]
}

const ProductsTable = ({ products }: ProductsTableProps) => {
  return (
    <Table colorScheme='whiteAlpha'>
      <Thead>
        <Tr>
          <Th>Ticker</Th>
          {PriceChangeIntervals.map((interval) => (
            <Th key={interval[0]}>{interval[0]}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {products.map((product) => (
          <Tr key={product.symbol}>
            <Td>
              <TickerCell product={product} />
            </Td>
            {PriceChangeIntervals.map((interval) => (
              <Td key={interval[0]}>
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
