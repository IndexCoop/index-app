import { useEffect, useState } from 'react'

import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from 'recharts'

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

interface MarketChartOptions {
  areaColor: string
  areaStrokeColor: string
  width?: number
  hideYAxis?: boolean
}

const MarketChart = (props: {
  productToken: ProductToken
  marketData: TokenMarketDataValues
  options: MarketChartOptions
  onMouseMove?: (...args: any[]) => any
  onMouseLeave?: (...args: any[]) => any
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
      case 3:
        handleQuarterlyButton()
        break
      case 4:
        handleYearlyButton()
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

  const mappedPriceData = () => prices.map(([x, y]) => ({ x, y }))
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
        data={mappedPriceData()}
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
          dataKey='y'
          stroke={props.options.areaStrokeColor}
          fill={props.options.areaStrokeColor}
        />
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
