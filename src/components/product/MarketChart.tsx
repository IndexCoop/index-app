import { useEffect, useState } from 'react'

import { Line, LineChart, XAxis, YAxis } from 'recharts'

import { Flex } from '@chakra-ui/layout'
import { Tab, TabList, Tabs, Text, theme } from '@chakra-ui/react'

import { ProductToken } from 'constants/productTokens'
import {
  TokenMarketDataValues,
  useMarketData,
} from 'contexts/MarketData/MarketDataProvider'

enum PriceChartRangeOption {
  DAILY_PRICE_RANGE = 1,
  WEEKLY_PRICE_RANGE = 7,
  MONTHLY_PRICE_RANGE = 30,
  QUARTERLY_PRICE_RANGE = 90,
  YEARLY_PRICE_RANGE = 365,
}

enum Durations {
  DAILY = 0,
  WEEKLY = 1,
  MONTHLY = 2,
  QUARTERLY = 3,
  YEARLY = 4,
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

const MarketChart = (props: {
  productToken: ProductToken
  marketData: TokenMarketDataValues
  onMouseMove?: (...args: any[]) => any
  onMouseLeave?: (...args: any[]) => any
  width?: number
}) => {
  const { selectLatestMarketData } = useMarketData()
  const formatFloats = (n: number) => n.toFixed(2)
  const [chartRange, setChartRange] = useState<number>(
    PriceChartRangeOption.MONTHLY_PRICE_RANGE
  )
  const [prices, setPrices] = useState(props.marketData.prices || [[]])
  const [durationSelector, setDurationSelector] = useState<number>(
    Durations.MONTHLY
  )

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

  useEffect(() => {
    setTimeout(() => {
      const hourlyDataInterval = 24
      if (props.marketData.hourlyPrices) {
        if (durationSelector === Durations.DAILY) {
          setPrices(
            props.marketData.hourlyPrices.slice(
              -PriceChartRangeOption.DAILY_PRICE_RANGE * hourlyDataInterval
            )
          ) //last day, hourly
        } else if (durationSelector === Durations.WEEKLY) {
          setPrices(
            props.marketData.hourlyPrices.slice(
              -PriceChartRangeOption.WEEKLY_PRICE_RANGE * hourlyDataInterval
            )
          ) //last 7 days, hourly
        } else if (durationSelector === Durations.MONTHLY) {
          setPrices(
            props.marketData.hourlyPrices.slice(
              -PriceChartRangeOption.MONTHLY_PRICE_RANGE * hourlyDataInterval
            )
          ) //last 30 days, hourly
        } else if (durationSelector === Durations.QUARTERLY) {
          setPrices(
            props.marketData.hourlyPrices.slice(
              -PriceChartRangeOption.QUARTERLY_PRICE_RANGE * hourlyDataInterval
            )
          ) //last 90 days, hourly
        } else if (
          durationSelector === Durations.YEARLY &&
          props.marketData.prices
        ) {
          setPrices(
            props.marketData.prices.slice(
              -PriceChartRangeOption.YEARLY_PRICE_RANGE
            )
          ) //last year, daily
        }
      }
    }, 0)
  }, [durationSelector, props.marketData])

  const handleDailyButton = () => {
    setDurationSelector(Durations.DAILY)
    setChartRange(PriceChartRangeOption.DAILY_PRICE_RANGE)
  }

  const handleWeeklyButton = () => {
    setDurationSelector(Durations.WEEKLY)
    setChartRange(PriceChartRangeOption.WEEKLY_PRICE_RANGE)
  }

  const handleMonthlyButton = () => {
    setDurationSelector(Durations.MONTHLY)
    setChartRange(PriceChartRangeOption.MONTHLY_PRICE_RANGE)
  }

  const handleQuarterlyButton = () => {
    setDurationSelector(Durations.QUARTERLY)
    setChartRange(PriceChartRangeOption.QUARTERLY_PRICE_RANGE)
  }

  const handleYearlyButton = () => {
    setDurationSelector(Durations.YEARLY)
    setChartRange(PriceChartRangeOption.YEARLY_PRICE_RANGE)
  }

  const onChangeDuration = (index: number) => {
    console.log(index)
    switch (index) {
      case 0:
        handleDailyButton()
        break
      case 1:
        handleWeeklyButton()
        break
      case 2:
        handleMonthlyButton()
        break
    }
  }

  const xAxisTickFormatter = (val: any) => {
    return new Date(val).toLocaleString('%b %d')
  }

  const mappedPriceData = () => prices.map(([x, y]) => ({ x, y }))

  const minY = Math.min(...prices.map<number>(([x, y]) => y))
  const maxY = Math.max(...prices.map<number>(([x, y]) => y))
  const minimumYAxisLabel = minY - 5 > 0 ? minY - 5 : 0

  return (
    <Flex direction='column' alignItems='center' width='100%'>
      <Flex
        direction='row'
        width='100%'
        alignItems='center'
        justifyContent='space-between'
      >
        <PriceDisplay
          price={`$${selectLatestMarketData(prices).toFixed()}`}
          change='+10.53 ( +5.89% )'
        />
        <RangeSelector onChange={onChangeDuration} />
      </Flex>
      <LineChart
        width={props.width ?? 900}
        height={600}
        data={mappedPriceData()}
      >
        <Line type='monotone' dataKey='y' stroke='#FABF00' />
        <YAxis
          stroke={strokeColor}
          axisLine={false}
          tickLine={false}
          mirror={true}
          domain={[minY - 5, maxY + 5]}
          orientation='right'
          width={100}
          dy={7}
          dx={1}
          hide={true}
        />
        <XAxis
          dataKey='y'
          stroke={strokeColor}
          // tickFormatter={xAxisTickFormatter}
        />
      </LineChart>
    </Flex>
  )
}

const strokeColor = theme.colors.gray[500]
const white = '#F6F1E4'
const selectedTabStyle = {
  bg: white,
  borderRadius: '4px',
  color: 'black',
  outline: 0,
}

export default MarketChart
