import { Box, Flex, Text } from '@chakra-ui/layout'

export interface ProductStat {
  title: string
  value: string
}

const ProductStatView = ({ title, value }: ProductStat) => (
  <Flex direction='column'>
    <Text fontSize='16px' fontWeight='400'>
      {title}
    </Text>
    <Text fontSize='28px' fontWeight='600' mt='16px'>
      {value}
    </Text>
  </Flex>
)

const ProductStats = ({ stats }: { stats: ProductStat[] }) => {
  return (
    <Flex
      alignItems={['flex-start', 'center']}
      direction='row'
      justify={['left', 'space-between']}
      w='100%'
      flexWrap='wrap'
    >
      {stats.map((productStat, index) => (
        <Box key={index} flexBasis={['50%', 'auto']}>
          <ProductStatView
            title={productStat.title}
            value={productStat.value}
          />
        </Box>
      ))}
    </Flex>
  )
}

export default ProductStats
