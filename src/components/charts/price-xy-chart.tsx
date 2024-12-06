import { withParentSize } from '@visx/responsive'
import {
  AnimatedAreaSeries,
  AnimatedLineSeries,
  Axis,
  Tooltip,
  XYChart,
} from '@visx/xychart'
import dayjs from 'dayjs'
import { useMemo } from 'react'

import { ChartTooltip } from '@/components/charts/chart-tooltip'
import { LinearGradientFill } from '@/components/charts/linear-gradient-fill'
import { darkTheme, lightTheme } from '@/components/charts/themes'
import { ChartPeriod } from '@/components/charts/types'
import { formatDollarAmount } from '@/lib/utils'
import { IndexData } from '@/lib/utils/api/index-data-provider'

type PriceChartIndexData = Pick<IndexData, 'NetAssetValue' | 'CreatedTimestamp'>

type Props = {
  data: PriceChartIndexData[]
  isDark?: boolean
  parentWidth: number
  parentHeight: number
  selectedPeriod: ChartPeriod
}

const tooltipTimestampFormatByPeriod: { [k in ChartPeriod]: string } = {
  [ChartPeriod.Hour]: 'DD MMM YYYY HH:mm',
  [ChartPeriod.Day]: 'DD MMM YYYY HH:mm',
  [ChartPeriod.Week]: 'DD MMM YYYY HH:mm',
  [ChartPeriod.Month]: 'DD MMM YYYY HH:mm',
  [ChartPeriod.Year]: 'DD MMM YYYY',
}

function PriceXYChart({
  data,
  isDark = false,
  parentWidth,
  parentHeight,
  selectedPeriod,
}: Props) {
  const { minDomainY, maxDomainY } = useMemo(() => {
    const prices = data.map(({ NetAssetValue }) => NetAssetValue!)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const diff = maxPrice - minPrice
    return {
      minDomainY: minPrice - diff * 0.05,
      maxDomainY: maxPrice + diff * 0.05,
    }
  }, [data])

  const seriesAccessors = {
    xAccessor: (d: PriceChartIndexData) => new Date(d.CreatedTimestamp),
    yAccessor: (d: PriceChartIndexData) => d.NetAssetValue,
  }

  const tooltipAccessors = {
    xAccessor: (d: PriceChartIndexData) =>
      dayjs(d.CreatedTimestamp).format(
        tooltipTimestampFormatByPeriod[selectedPeriod],
      ),
    yAccessor: (d: PriceChartIndexData) => formatDollarAmount(d.NetAssetValue),
  }

  if (parentHeight === 0 || parentWidth === 0) return null

  return (
    <XYChart
      height={parentHeight}
      width={parentWidth}
      margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
      theme={isDark ? darkTheme : lightTheme}
      xScale={{ type: 'time' }}
      yScale={{
        type: 'linear',
        domain: [minDomainY, maxDomainY],
        nice: true,
        zero: false,
      }}
    >
      <Axis
        orientation='left'
        numTicks={5}
        tickFormat={(d) => `$${d.toFixed(maxDomainY >= 1000 ? 0 : 2)}`}
      />
      <Axis orientation='bottom' numTicks={parentWidth > 500 ? 5 : 3} />
      <AnimatedLineSeries {...seriesAccessors} dataKey='prices' data={data} />
      <AnimatedAreaSeries
        {...seriesAccessors}
        fill='url(#gradient)'
        dataKey='prices'
        data={data}
      />
      <LinearGradientFill isDark={isDark} />
      <Tooltip
        snapTooltipToDatumX
        snapTooltipToDatumY
        showVerticalCrosshair
        showSeriesGlyphs
        renderTooltip={({ tooltipData }) => (
          <ChartTooltip
            isDark={isDark}
            line1={tooltipAccessors.yAccessor(
              tooltipData?.nearestDatum?.datum as PriceChartIndexData,
            )}
            line2={tooltipAccessors.xAccessor(
              tooltipData?.nearestDatum?.datum as PriceChartIndexData,
            )}
          />
        )}
      />
    </XYChart>
  )
}

export default withParentSize(PriceXYChart)
