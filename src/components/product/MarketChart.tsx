import { useEffect, useState } from 'react'

import { Line, LineChart, YAxis } from 'recharts'

import { Flex, Spacer } from '@chakra-ui/layout'
import { Button, theme } from '@chakra-ui/react'

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

const MarketChart = (props: {
  productToken: ProductToken
  marketData: TokenMarketDataValues
  onMouseMove?: (...args: any[]) => any
  onMouseLeave?: (...args: any[]) => any
}) => {
  const { selectLatestMarketData } = useMarketData()
  const formatFloats = (n: number) => n.toFixed(2)
  const [latestPrice, setLatestPrice] = useState(
    selectLatestMarketData(props.marketData.hourlyPrices)
  )
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
    console.log('hourlyData', prices)
  }, [durationSelector])

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

  const tickFormatter = (val: any) => {
    if (val <= minY) return 'Min: $' + formatFloats(val)
    return 'Max: $' + formatFloats(val)
  }

  const minY = Math.min(
    ...(props.marketData.hourlyPrices || []).map<number>(([x, y]) => y)
  )
  const maxY = Math.max(
    ...(props.marketData.hourlyPrices || []).map<number>(([x, y]) => y)
  )
  const minimumYAxisLabel = minY - 5 > 0 ? minY - 5 : 0

  return (
    <Flex
      direction='column'
      alignItems='center'
      margin='20px 40px'
      padding='10px'
      width='40vw'
    >
      <Flex>
        <LineChart
          data={prices}
          onMouseMove={props.onMouseMove}
          onMouseLeave={props.onMouseLeave}
          height={400}
          width={400}
        >
          <Line
            type='monotone'
            dataKey='y'
            dot={false}
            stroke='#FABF00'
            strokeWidth={2}
            animationEasing='ease'
            animationDuration={600}
          />
        </LineChart>
      </Flex>
      <Flex>
        <Button
          full
          size={'sm'}
          text='1D'
          variant={
            durationSelector === Durations.DAILY ? 'default' : 'secondary'
          }
          onClick={handleDailyButton}
        />
        <Spacer size={'sm'} />
        <Button
          full
          size={'sm'}
          text='1W'
          variant={
            durationSelector === Durations.WEEKLY ? 'default' : 'secondary'
          }
          onClick={handleWeeklyButton}
        />
        <Spacer size={'sm'} />
        <Button
          full
          size={'sm'}
          text='1M'
          variant={
            durationSelector === Durations.MONTHLY ? 'default' : 'secondary'
          }
          onClick={handleMonthlyButton}
        />
        <Spacer size={'sm'} />
        <Button
          full
          size={'sm'}
          text='3M'
          variant={
            durationSelector === Durations.QUARTERLY ? 'default' : 'secondary'
          }
          onClick={handleQuarterlyButton}
        />
        <Spacer size={'sm'} />
        <Button
          full
          size={'sm'}
          text='1Y'
          variant={
            durationSelector === Durations.YEARLY ? 'default' : 'secondary'
          }
          onClick={handleYearlyButton}
        />
      </Flex>
    </Flex>
  )
}

export default MarketChart
