import { useEffect, useState } from 'react'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { colors, useICColorMode } from 'styles/colors'

import { Box, Flex, Spacer } from '@chakra-ui/layout'
import { Tab, TabList, Tabs, Text, useTheme } from '@chakra-ui/react'

export enum Durations {
  DAILY = 0,
  WEEKLY = 1,
  MONTHLY = 2,
  QUARTERLY = 3,
  YEARLY = 4,
}

export enum PriceChartRangeOption {
  DAILY_PRICE_RANGE = 1,
  WEEKLY_PRICE_RANGE = 7,
  MONTHLY_PRICE_RANGE = 30,
  QUARTERLY_PRICE_RANGE = 90,
  YEARLY_PRICE_RANGE = 365,
}

interface MarketChartOptions {
  width?: number
  height?: number
  hideYAxis?: boolean
}

interface MarketChartPriceChange {
  label: string
  isPositive: boolean
}

export interface PriceChartData {
  x: number
  y1: number
  y2?: number
  y3?: number
  y4?: number
  y5?: number
}

const MarketChart = (props: {
  marketData: PriceChartData[][]
  prices: string[]
  priceChanges: MarketChartPriceChange[]
  options: MarketChartOptions
  customSelector?: any
  onMouseMove?: (...args: any[]) => any
  onMouseLeave?: (...args: any[]) => any
}) => {
  const theme = useTheme()
  const { isDarkMode } = useICColorMode()
  const strokeColor = isDarkMode ? colors.gray[500] : colors.gray[400]

  const [chartData, setChartData] = useState<PriceChartData[]>([])
  const [durationSelector, setDurationSelector] = useState<number>(
    Durations.DAILY
  )

  useEffect(() => {
    if (props.marketData.length < 1) {
      return
    }
    const index = durationSelector
    const chartData = props.marketData[index]
    setChartData(chartData)
  }, [durationSelector, props.marketData])

  const onChangeDuration = (index: number) => {
    switch (index) {
      case 0:
        setDurationSelector(Durations.DAILY)
        break
      case 1:
        setDurationSelector(Durations.WEEKLY)
        break
      case 2:
        setDurationSelector(Durations.MONTHLY)
        break
      case 3:
        setDurationSelector(Durations.QUARTERLY)
        break
      case 4:
        setDurationSelector(Durations.YEARLY)
        break
    }
  }

  const dateFormatterOptions = (
    duration: Durations
  ): Intl.DateTimeFormatOptions => {
    switch (duration) {
      case Durations.DAILY:
        return {
          hour: '2-digit',
        }
      default:
        return {
          month: 'short',
          day: '2-digit',
        }
    }
  }

  const xAxisTickFormatter = (val: any | null | undefined) => {
    var options = dateFormatterOptions(durationSelector)
    return new Date(val).toLocaleString(undefined, options)
  }

  const yAxisTickFormatter = (val: any | null | undefined) => {
    if (val === undefined || val === null) {
      return ''
    }
    return `$${parseInt(val)}`
  }

  const minY = Math.min(
    ...chartData.map<number>((data) =>
      Math.min(
        data.y1,
        data.y2 ?? data.y1,
        data.y3 ?? data.y1,
        data.y4 ?? data.y1,
        data.y5 ?? data.y1
      )
    )
  )
  const maxY = Math.max(
    ...chartData.map<number>((data) =>
      Math.max(
        data.y1,
        data.y2 ?? data.y1,
        data.y3 ?? data.y1,
        data.y4 ?? data.y1,
        data.y5 ?? data.y1
      )
    )
  )
  const minYAdjusted = minY > 4 ? minY - 5 : 0
  const yAxisDomain = [minYAdjusted, maxY + 5]

  const price =
    props.prices.length === 1 ? props.prices[0] : props.prices[durationSelector]
  const priceChange = props.priceChanges[durationSelector]
  const priceChangeColor = priceChange.isPositive
    ? colors.icMalachite
    : colors.icRed

  return (
    <Flex direction='column' alignItems='center' width='100%'>
      <Flex
        direction={['column', 'row']}
        alignItems={['left', 'center']}
        mb='24px'
        w='100%'
      >
        <PriceDisplay
          price={price}
          change={priceChange.label}
          color={priceChangeColor}
        />
        <Spacer />
        {props.customSelector !== null && (
          <Box mr={['auto', '24px']}>{props.customSelector}</Box>
        )}
        <Box mt={['8px', '0']} mr='auto'>
          <RangeSelector onChange={onChangeDuration} />
        </Box>
      </Flex>
      <AreaChart
        width={props.options.width ?? 900}
        height={props.options.height ?? 400}
        data={chartData}
      >
        <CartesianGrid stroke={strokeColor} strokeOpacity={0.2} />
        <YAxis
          axisLine={false}
          domain={yAxisDomain}
          stroke={strokeColor}
          tickCount={10}
          tickFormatter={yAxisTickFormatter}
          tickLine={false}
          hide={props.options.hideYAxis ?? true}
        />
        <XAxis
          axisLine={false}
          dataKey='x'
          dy={10}
          interval='preserveStart'
          minTickGap={100}
          stroke={strokeColor}
          tickCount={6}
          tickFormatter={xAxisTickFormatter}
          tickLine={false}
        />
        <Area
          type='monotone'
          dataKey='y1'
          stroke={theme.colors.icApricot}
          fill={theme.colors.icApricot}
        />
        <Area
          type='monotone'
          dataKey='y2'
          stroke={theme.colors.icBlue}
          fill={theme.colors.icBlue}
        />
        <Area
          type='monotone'
          dataKey='y3'
          stroke={theme.colors.icPeriwinkle}
          fill={theme.colors.icPeriwinkle}
        />
        <Area
          type='monotone'
          dataKey='y4'
          stroke={theme.colors.icLazurite}
          fill={theme.colors.icLazurite}
        />
        <Area
          type='monotone'
          dataKey='y5'
          stroke={theme.colors.icYellow}
          fill={theme.colors.icYellow}
        />
      </AreaChart>
    </Flex>
  )
}

const PriceDisplay = ({
  price,
  change,
  color,
  customSelector,
}: {
  price: string
  change: string
  color: string
  customSelector?: any
}) => (
  <Flex align='center'>
    <Flex align='baseline'>
      <Text fontSize={['3xl', '5xl']} color={colors.icYellow} fontWeight='700'>
        {price}
      </Text>
      <Text fontSize={['md', 'xl']} color={color} fontWeight='700' ml='16px'>
        {change}
      </Text>
    </Flex>
    <Box ml='24px' mt='8px'>
      {customSelector !== null && customSelector}
    </Box>
  </Flex>
)

const RangeSelector = ({ onChange }: { onChange: (index: number) => void }) => (
  <Tabs variant='unstyled' onChange={onChange}>
    <TabList>
      <Tab>1D</Tab>
      <Tab>1W</Tab>
      <Tab>1M</Tab>
    </TabList>
  </Tabs>
)

export default MarketChart
