import { Tab, TabList, Tabs } from '@chakra-ui/react'

interface ChartTypeSelectorProps {
  onChange: (index: number) => void
}

export const ChartTypeSelector = ({ onChange }: ChartTypeSelectorProps) => (
  <Tabs variant='unstyled' onChange={onChange}>
    <TabList>
      <Tab>Chart</Tab>
      <Tab>Allocation</Tab>
    </TabList>
  </Tabs>
)
