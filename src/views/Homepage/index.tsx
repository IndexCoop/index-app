import { Box, Flex } from '@chakra-ui/react'

import Page from 'components/page/Page'
import QuickTradeContainer from 'components/trade'

const Homepage = () => {
  return (
    <Page>
      <Flex mx='auto'>
        <Box mb={12} w={['inherit', '500px']}>
          <QuickTradeContainer />
        </Box>
      </Flex>
    </Page>
  )
}

export default Homepage
