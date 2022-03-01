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
      pr={['0', '48px']}
      flexWrap='wrap'
    >
      {stats.map((productStat, index) => (
        <Box key={index} mr={['32px', '0']} mb={['48px', '0']}>
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
