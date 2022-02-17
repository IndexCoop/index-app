import { Flex, Text } from '@chakra-ui/layout'

interface ProductStat {
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
      alignItems='center'
      direction='row'
      justify='space-between'
      w='100%'
      pr='48px'
    >
      {stats.map((productStat, index) => (
        <ProductStatView
          key={index}
          title={productStat.title}
          value={productStat.value}
        />
      ))}
    </Flex>
  )
}

export default ProductStats
