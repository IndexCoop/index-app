import { useEffect, useState } from 'react'

import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from 'recharts'

import { Flex } from '@chakra-ui/layout'
import { Tab, TabList, Tabs, Text, theme, useTheme } from '@chakra-ui/react'

import { ProductToken } from 'constants/productTokens'
import {
  TokenMarketDataValues,
  useMarketData,
} from 'contexts/MarketData/MarketDataProvider'
import { getChartData } from './PriceChartData'

enum Durations {
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
  areaColor: string
  areaStrokeColor: string
  width?: number
  hideYAxis?: boolean
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
  // TODO: might not need this?
  productToken: ProductToken
  // TODO: convert to array
  marketData: TokenMarketDataValues[]
  options: MarketChartOptions
  onMouseMove?: (...args: any[]) => any
  onMouseLeave?: (...args: any[]) => any
}) => {
  const { selectLatestMarketData } = useMarketData()
  const formatFloats = (n: number) => n.toFixed(2)
  const [chartData, setChartData] = useState<PriceChartData[]>([])
  const [durationSelector, setDurationSelector] = useState<number>(
    Durations.MONTHLY
  )

  const getRangeForSelectedDuration = () => {
    switch (durationSelector) {
      case Durations.WEEKLY:
        return PriceChartRangeOption.WEEKLY_PRICE_RANGE
      case Durations.MONTHLY:
        return PriceChartRangeOption.MONTHLY_PRICE_RANGE
      case Durations.QUARTERLY:
        return PriceChartRangeOption.QUARTERLY_PRICE_RANGE
      case Durations.YEARLY:
        return PriceChartRangeOption.YEARLY_PRICE_RANGE
      default:
        return PriceChartRangeOption.DAILY_PRICE_RANGE
    }
  }

  useEffect(() => {
    setTimeout(() => {
      const range = getRangeForSelectedDuration()
      const prices = props.marketData.map((data) => data.hourlyPrices ?? [])
      const chartData = getChartData(range, prices)
      setChartData(chartData)
    })
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

  // TODO: ?
  const formatToolTip = (chartData: any) => {
    if (!chartData) return ['--', 'No Data Available']
    const {
      payload: { x, y },
    } = chartData
    let timeString = new Date(x).toLocaleDateString()
    if (durationSelector === Durations.DAILY) {
      timeString = new Date(x).toLocaleTimeString([], {
        hour: 'numeric',
        minute: 'numeric',
      })
    }
    return [timeString, '$' + formatFloats(y)]
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

  // TODO: calc from all y's
  const minY = Math.min(...prices.map<number>(([x, y]) => y))
  const maxY = Math.max(...prices.map<number>(([x, y]) => y))

  return (
    <Flex direction='column' alignItems='center' width='100%'>
      <Flex
        direction='row'
        width='100%'
        alignItems='center'
        justifyContent='space-between'
        mb='24px'
      >
        <PriceDisplay
          price={`$${selectLatestMarketData(prices).toFixed()}`}
          // TODO: add price change
          change='+10.53 ( +5.89% )'
        />
        <RangeSelector onChange={onChangeDuration} />
      </Flex>
      <AreaChart
        width={props.options.width ?? 900}
        height={400}
        data={chartData}
      >
        <Line type='monotone' dataKey='y' stroke='#FABF00' />
        <CartesianGrid stroke={white} strokeOpacity={0.2} />
        <YAxis
          axisLine={false}
          domain={[minY - 5, maxY + 5]}
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
          stroke={props.options.areaStrokeColor}
          fill={props.options.areaStrokeColor}
        />
        <Area type='monotone' dataKey='y2' stroke={'yellow'} fill={'blue'} />
        <Area type='monotone' dataKey='y3' stroke={'yellow'} fill={'blue'} />
        <Area type='monotone' dataKey='y4' stroke={'yellow'} fill={'blue'} />
        <Area type='monotone' dataKey='y5' stroke={'yellow'} fill={'blue'} />
      </AreaChart>
    </Flex>
  )
}

const PriceDisplay = ({ price, change }: { price: string; change: string }) => (
  <Flex align='baseline'>
    <Text fontSize='5xl' color='#FABF00' fontWeight='700'>
      {price}
    </Text>
    <Text fontSize='xl' color='#09AA74 ' fontWeight='700' ml='24px'>
      {change}
    </Text>
  </Flex>
)

const RangeSelector = ({ onChange }: { onChange: (index: number) => void }) => (
  <Tabs
    background='#1D1B16'
    borderRadius='8px'
    fontSize='16px'
    fontWeight='500'
    color={white}
    height='45px'
    outline='0'
    variant='unstyle'
    onChange={onChange}
  >
    <TabList>
      <Tab _selected={selectedTabStyle}>1D</Tab>
      <Tab _selected={selectedTabStyle}>1W</Tab>
      <Tab _selected={selectedTabStyle}>1M</Tab>
    </TabList>
  </Tabs>
)

const strokeColor = theme.colors.gray[500]
const white = '#F6F1E4'
const selectedTabStyle = {
  bg: white,
  borderRadius: '4px',
  color: 'black',
  outline: 0,
}

export default MarketChart
