import { Grid, GridItem, Image, Link, Text } from '@chakra-ui/react'

import { ProductsTableProduct } from 'components/views/Products'

type TickerCellProps = {
  product: ProductsTableProduct
}

const TickerCell = ({ product }: TickerCellProps) => {
  return (
    <Link href={'/products/' + product.symbol.toLowerCase()}>
      <Grid
        width='320px'
        templateRows='repeat(2, 1fr)'
        templateColumns='70px auto'
      >
        <GridItem colStart={1} rowSpan={2}>
          <Image
            src={product.image}
            fallbackSrc='https://app.indexcoop.com/static/media/index-token.c853e1be.png'
            boxSize={50}
          />
        </GridItem>
        <GridItem colStart={2}>
          <Text fontSize='sm' variant='secondary' align='left'>
            {product.name}
          </Text>
        </GridItem>
        <GridItem colStart={2}>
          <Text fontSize='xl'>{product.symbol}</Text>
        </GridItem>
      </Grid>
    </Link>
  )
}

export default TickerCell
