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

import { formatPercentage } from '@/app/products/utils/formatters'
import { ChartTooltip } from '@/components/charts/chart-tooltip'
import { LinearGradientFill } from '@/components/charts/linear-gradient-fill'
import { darkTheme, lightTheme } from '@/components/charts/themes'
import { ChartPeriod } from '@/components/charts/types'
import { tooltipTimestampFormat } from '@/constants/charts'
import { IndexData } from '@/lib/utils/api/index-data-provider'

type ApyChartIndexData = Pick<IndexData, 'APY' | 'CreatedTimestamp'>

type Props = {
  data: ApyChartIndexData[]
  isDark?: boolean
  parentWidth: number
  parentHeight: number
  selectedPeriod: ChartPeriod
}

function TvlXYChart({
  data,
  isDark = false,
  parentWidth,
  parentHeight,
  selectedPeriod,
}: Props) {
  const { minDomainY, maxDomainY } = useMemo(() => {
    const apys = data.map(({ APY }) => APY!)
    const minApy = Math.min(...apys)
    const maxApy = Math.max(...apys)
    const diff = maxApy - minApy
    return {
      minDomainY: minApy - diff * 0.05,
      maxDomainY: maxApy + diff * 0.05,
    }
  }, [data])

  const seriesAccessors = {
    xAccessor: (d: ApyChartIndexData) => new Date(d.CreatedTimestamp),
    yAccessor: (d: ApyChartIndexData) => d.APY,
  }

  const tooltipAccessors = {
    xAccessor: (d: ApyChartIndexData) =>
      dayjs(d.CreatedTimestamp).format(tooltipTimestampFormat[selectedPeriod]),
    yAccessor: (d: ApyChartIndexData) => formatPercentage(d.APY),
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
        tickFormat={(d) => formatPercentage(d)}
      />
      <Axis orientation='bottom' numTicks={5} />
      <AnimatedLineSeries {...seriesAccessors} dataKey='tvls' data={data} />
      <AnimatedAreaSeries
        {...seriesAccessors}
        fill='url(#gradient)'
        dataKey='tvls'
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
              tooltipData?.nearestDatum?.datum as ApyChartIndexData,
            )}
            line2={tooltipAccessors.xAccessor(
              tooltipData?.nearestDatum?.datum as ApyChartIndexData,
            )}
          />
        )}
      />
    </XYChart>
  )
}

export default withParentSize(TvlXYChart)
