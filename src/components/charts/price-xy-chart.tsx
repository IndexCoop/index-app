import { LinearGradient } from '@visx/gradient'
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

import { customTheme } from '@/components/charts/custom-theme'
import { ChartPeriod } from '@/components/charts/types'
import { formatDollarAmount } from '@/lib/utils'
import { IndexData } from '@/lib/utils/api/index-data-provider'

type Props = {
  data: Pick<IndexData, 'NetAssetValue' | 'CreatedTimestamp'>[]
  parentWidth: number
  parentHeight: number
  selectedPeriod: ChartPeriod
}

const tooltipTimestampFormatByPeriod: { [k in ChartPeriod]: string } = {
  [ChartPeriod.Hour]: 'DD MMM YYYY HH:mm',
  [ChartPeriod.Day]: 'DD MMM YYYY HH:mm',
  [ChartPeriod.Week]: 'DD MMM YYYY HH:mm',
  [ChartPeriod.Month]: 'DD MMM YYYY',
  [ChartPeriod.Year]: 'DD MMM YYYY',
}

type LineChartIndexData = Pick<IndexData, 'NetAssetValue' | 'CreatedTimestamp'>

function PriceXYChart({
  data,
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
    xAccessor: (d: LineChartIndexData) => new Date(d.CreatedTimestamp),
    yAccessor: (d: LineChartIndexData) => d.NetAssetValue,
  }

  const tooltipAccessors = {
    xAccessor: (d: LineChartIndexData) =>
      dayjs(d.CreatedTimestamp).format(
        tooltipTimestampFormatByPeriod[selectedPeriod],
      ),
    yAccessor: (d: LineChartIndexData) => formatDollarAmount(d.NetAssetValue),
  }

  return (
    <XYChart
      height={parentHeight}
      width={parentWidth}
      margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
      theme={customTheme}
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
        tickFormat={(d) => d.toFixed(maxDomainY >= 1000 ? 0 : 2)}
      />
      <Axis orientation='bottom' numTicks={5} />
      <AnimatedLineSeries {...seriesAccessors} dataKey='prices' data={data} />
      <AnimatedAreaSeries
        {...seriesAccessors}
        fill='url(#gradient)'
        dataKey='prices'
        data={data}
      />
      <LinearGradient
        from='#84e9e9'
        to='#143438'
        id='gradient'
        fromOpacity={0.2}
        toOpacity={0.1}
      />
      <Tooltip
        snapTooltipToDatumX
        snapTooltipToDatumY
        showVerticalCrosshair
        showSeriesGlyphs
        renderTooltip={({ tooltipData }) => (
          <div>
            <div className='text-ic-white mb-1 text-[14px] font-bold'>
              {tooltipAccessors.yAccessor(
                tooltipData?.nearestDatum?.datum as LineChartIndexData,
              )}
            </div>
            <div className='text-ic-gray-300 text-xs font-light'>
              {tooltipAccessors.xAccessor(
                tooltipData?.nearestDatum?.datum as LineChartIndexData,
              )}
            </div>
          </div>
        )}
      />
    </XYChart>
  )
}

export default withParentSize(PriceXYChart)
