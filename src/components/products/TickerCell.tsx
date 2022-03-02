import {
  Grid,
  GridItem,
  Image,
  Link,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'

import { ProductsTableProduct } from 'components/views/Products'

type TickerCellProps = {
  product: ProductsTableProduct
}

const TickerCell = ({ product }: TickerCellProps) => {
  const isWeb = useBreakpointValue({
    base: false,
    md: true,
    lg: true,
    xl: true,
  })

  return (
    <Link href={'/' + product.url}>
      <Grid
        width={['inherit', 'inherit', '320px']}
        templateRows={['', '', 'repeat(2, 1fr)']}
        templateColumns={['32px auto', '32px auto', '70px auto']}
      >
        <GridItem colStart={1} rowSpan={2}>
          <Image
            src={product.image}
            fallbackSrc='https://app.indexcoop.com/static/media/index-token.c853e1be.png'
            h={[25, 25, 50, 50]}
          />
        </GridItem>
        {isWeb && (
          <GridItem colStart={2}>
            <Text fontSize='sm' variant='secondary' align='left'>
              {product.name}
            </Text>
          </GridItem>
        )}
        <GridItem colStart={2}>
          <Text
            fontSize={['sm', 'sm', 'xl']}
            fontWeight={['600', '600', '500']}
          >
            {product.symbol}
          </Text>
        </GridItem>
      </Grid>
    </Link>
  )
}

export default TickerCell
