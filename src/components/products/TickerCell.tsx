import { Box, Grid, GridItem, Link } from '@chakra-ui/react'

import { ProductsTableProduct } from 'components/views/Products'

type TickerCellProps = {
  product: ProductsTableProduct
}

const mockImage = () => (
  <Box width={'50px'} height={'50px'} bgColor={'purple.500'} />
)

const TickerCell = ({ product }: TickerCellProps) => {
  return (
    <Link href={'/' + product.symbol}>
      <Grid column={2} row={1} width={'250px'}>
        <GridItem colStart={1} rowSpan={2}>
          {mockImage()}
        </GridItem>
        <GridItem colStart={2}>{product.name}</GridItem>
        <GridItem colStart={2}>{product.symbol}</GridItem>
      </Grid>
    </Link>
  )
}

export default TickerCell
