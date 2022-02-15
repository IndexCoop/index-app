import { colors } from 'styles/colors'
import { selectedTabStyle } from 'styles/tabs'

import { Tab, TabList, Tabs } from '@chakra-ui/react'

export const ChartStyleSelector = ({
  onChange,
}: {
  onChange: (index: number) => void
}) => (
  <Tabs
    background='#1D1B16'
    borderRadius='8px'
    fontSize='16px'
    fontWeight='500'
    color={colors.icWhite}
    height='45px'
    outline='0'
    variant='unstyle'
    onChange={onChange}
  >
    <TabList>
      <Tab _selected={selectedTabStyle}>Chart</Tab>
      <Tab _selected={selectedTabStyle}>Allocation</Tab>
    </TabList>
  </Tabs>
)
