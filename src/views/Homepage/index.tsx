import { Box, Flex } from '@chakra-ui/react'

import Page from 'components/page/Page'
import QuickTradeContainer from 'components/trade'

const Homepage = () => {
  return (
    <Page>
      <Flex
        align={'center'}
        direction={'column'}
        justify={'center'}
        mx='auto'
        w={['340px', '500px', '820px', '1024px']}
      >
        <Box mb={12} w={['inherit', '500px']}>
          <QuickTradeContainer />
        </Box>
      </Flex>
    </Page>
  )
}

export default Homepage
