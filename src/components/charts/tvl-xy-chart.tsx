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

import { formatTvl } from '@/app/products/utils/formatters'
import { ChartTooltip } from '@/components/charts/chart-tooltip'
import { LinearGradientFill } from '@/components/charts/linear-gradient-fill'
import { darkTheme, lightTheme } from '@/components/charts/themes'
import { ChartPeriod } from '@/components/charts/types'
import { tooltipTimestampFormat } from '@/constants/charts'
import { IndexData } from '@/lib/utils/api/index-data-provider'

type TvlChartIndexData = Pick<
  IndexData,
  'ProductAssetValue' | 'CreatedTimestamp'
>

type Props = {
  data: TvlChartIndexData[]
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
    const tvls = data.map(({ ProductAssetValue }) => ProductAssetValue!)
    const minTvl = Math.min(...tvls)
    const maxTvl = Math.max(...tvls)
    const diff = maxTvl - minTvl
    return {
      minDomainY: minTvl - diff * 0.05,
      maxDomainY: maxTvl + diff * 0.05,
    }
  }, [data])

  const seriesAccessors = {
    xAccessor: (d: TvlChartIndexData) => new Date(d.CreatedTimestamp),
    yAccessor: (d: TvlChartIndexData) => d.ProductAssetValue,
  }

  const tooltipAccessors = {
    xAccessor: (d: TvlChartIndexData) =>
      dayjs(d.CreatedTimestamp).format(tooltipTimestampFormat[selectedPeriod]),
    yAccessor: (d: TvlChartIndexData) => formatTvl(d.ProductAssetValue),
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
      <Axis orientation='left' numTicks={5} tickFormat={(d) => formatTvl(d)} />
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
              tooltipData?.nearestDatum?.datum as TvlChartIndexData,
            )}
            line2={tooltipAccessors.xAccessor(
              tooltipData?.nearestDatum?.datum as TvlChartIndexData,
            )}
          />
        )}
      />
    </XYChart>
  )
}

export default withParentSize(TvlXYChart)
