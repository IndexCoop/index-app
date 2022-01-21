import { Box, Flex, Link, Text } from '@chakra-ui/react'

import Page from 'components/Page'
import PageTitle from 'components/PageTitle'
import ProductsTable from 'components/products/ProductsTable'
import SectionTitle from 'components/SectionTitle'

export type ProductsTableProduct = {
  name?: string
  // image: '',
  symbol: string
  performance: {
    '1D': number
    '1W': number
    '1M': number
    '3M': number
    '1Y': number
  }
}

const tempProducts = [
  {
    name: 'Defi Pulse Index',
    // image: '',
    symbol: 'DPI',
    performance: {
      '1D': -3.24,
      '1W': 5.03,
      '1M': -10.4,
      '3M': 3.42,
      '1Y': 16.34,
    },
  },
  {
    // name: '',
    // image: '',
    symbol: 'MVI',
    performance: {
      '1D': -3.24,
      '1W': 5.03,
      '1M': -10.4,
      '3M': 3.42,
      '1Y': 16.34,
    },
  },
  {
    // name: '',
    // image: '',
    symbol: 'DATA',
    performance: {
      '1D': -3.24,
      '1W': 5.03,
      '1M': -10.4,
      '3M': 3.42,
      '1Y': 16.34,
    },
  },
  {
    // name: '',
    // image: '',
    symbol: 'BED',
    performance: {
      '1D': -3.24,
      '1W': 5.03,
      '1M': -10.4,
      '3M': 3.42,
      '1Y': 16.34,
    },
  },
  {
    // name: '',
    // image: '',
    symbol: 'GMI',
    performance: {
      '1D': -3.24,
      '1W': 5.03,
      '1M': -10.4,
      '3M': 3.42,
      '1Y': 16.34,
    },
  },
  {
    // name: '',
    // image: '',
    symbol: 'ETH2x-FLI',
    performance: {
      '1D': -3.24,
      '1W': 5.03,
      '1M': -10.4,
      '3M': 3.42,
      '1Y': 16.34,
    },
  },
  {
    // name: '',
    // image: '',
    symbol: 'ETH2x-FLI-P',
    performance: {
      '1D': -3.24,
      '1W': 5.03,
      '1M': -10.4,
      '3M': 3.42,
      '1Y': 16.34,
    },
  },
  {
    // name: '',
    // image: '',
    symbol: 'BTC2x-FLI',
    performance: {
      '1D': -3.24,
      '1W': 5.03,
      '1M': -10.4,
      '3M': 3.42,
      '1Y': 16.34,
    },
  },
]

const Dashboard = () => {
  return (
    <Page>
      <Box minW='1280px' mx='auto'>
        <PageTitle
          title='Discover Index Coop Indices'
          subtitle='Short overview of your Index Coop Tokens'
        />
        <Box my={12}>
          <ProductsTable products={tempProducts} />
        </Box>
      </Box>
    </Page>
  )
}

export default Dashboard
