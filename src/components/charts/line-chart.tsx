import { withParentSize } from '@visx/responsive'
import { AnimatedLineSeries, Axis, Tooltip, XYChart } from '@visx/xychart'
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

const timestampFormatByPeriod: { [k in ChartPeriod]: string } = {
  [ChartPeriod.Hour]: 'HH:mm',
  [ChartPeriod.Day]: 'HH:mm',
  [ChartPeriod.Week]: 'MMM DD HH:mm',
  [ChartPeriod.Month]: 'MMM DD',
  [ChartPeriod.Year]: 'MMM DD',
}

const tooltipTimestampFormatByPeriod: { [k in ChartPeriod]: string } = {
  [ChartPeriod.Hour]: 'DD MMM YYYY HH:mm',
  [ChartPeriod.Day]: 'DD MMM YYYY HH:mm',
  [ChartPeriod.Week]: 'DD MMM YYYY HH:mm',
  [ChartPeriod.Month]: 'DD MMM YYYY',
  [ChartPeriod.Year]: 'DD MMM YYYY',
}

type LineChartIndexData = Pick<IndexData, 'NetAssetValue' | 'CreatedTimestamp'>

function LineChart({ data, parentWidth, parentHeight, selectedPeriod }: Props) {
  const { minDomain, maxDomain } = useMemo(() => {
    const prices = data.map(({ NetAssetValue }) => NetAssetValue!)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    return {
      minDomain: minPrice * 0.995,
      maxDomain: maxPrice * 1.005,
    }
  }, [data])

  const accessors = {
    xAccessor: (d: LineChartIndexData) =>
      dayjs(d.CreatedTimestamp).format(timestampFormatByPeriod[selectedPeriod]),
    yAccessor: (d: LineChartIndexData) => d.NetAssetValue!.toFixed(2),
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
      theme={customTheme}
      xScale={{ type: 'band' }}
      yScale={{
        type: 'linear',
        domain: [minDomain, maxDomain],
        zero: false,
      }}
    >
      <Axis orientation='left' tickFormat={(d) => d.toFixed(2)} />
      <Axis orientation='bottom' numTicks={5} />
      <AnimatedLineSeries {...accessors} dataKey='prices' data={data} />
      <Tooltip
        snapTooltipToDatumX
        snapTooltipToDatumY
        showVerticalCrosshair
        showSeriesGlyphs
        renderTooltip={({ tooltipData }) => (
          <div>
            <div className='text-ic-white text-xs font-bold'>
              {tooltipAccessors.yAccessor(
                tooltipData?.nearestDatum?.datum as LineChartIndexData,
              )}
            </div>
            <div className='text-ic-gray-300 text-xs'>
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

export default withParentSize(LineChart)
