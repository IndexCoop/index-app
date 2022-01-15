import { Box, Button } from '@chakra-ui/react'

import Page from 'components/Page'
import PageTitle from 'components/PageTitle'
import { useMarketData } from 'contexts/MarketData/MarketDataProvider'

const Dashboard = () => {
  const { dpi } = useMarketData()
  return (
    <Page>
      <Box minW='1280px' mx='auto'>
        <PageTitle
          title='My Page'
          subtitle='Short overview of your Index Coop Tokens'
        />
        <Box my={12}>
          <PageTitle
            title='My Page'
            subtitle='Short overview of your Index Coop Tokens'
          />
        </Box>
        <Button>Claim Rewards</Button>
        <Button variant='gray'>Claim Rewards</Button>
        <Button variant='purple'>Claim Rewards</Button>
      </Box>
    </Page>
  )
}

export default Dashboard
