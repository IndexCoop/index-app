import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'

import TickerCell from 'components/products/TickerCell'
import { ProductsTableProduct } from 'components/views/Products'

type ProductsTableProps = {
  products: ProductsTableProduct[]
}

const ProductsTable = ({ products }: ProductsTableProps) => {
  return (
    <Table colorScheme='whiteAlpha'>
      <Thead>
        <Th>Ticker</Th>
        <Th>1D</Th>
        <Th>1W</Th>
        <Th>1M</Th>
        <Th>3M</Th>
        <Th>1Y</Th>
      </Thead>
      <Tbody>
        {products.map((product) => (
          <Tr key={product.symbol}>
            <Td>
              <TickerCell product={product} />
            </Td>
            <Td>{product.performance?.['1D'] ?? '--'}%</Td>
            <Td>{product.performance?.['1W'] ?? '--'}%</Td>
            <Td>{product.performance?.['1M'] ?? '--'}%</Td>
            <Td>{product.performance?.['3M'] ?? '--'}%</Td>
            <Td>{product.performance?.['1Y'] ?? '--'}%</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

export default ProductsTable
