import { curveBasis } from '@visx/curve'
import { withParentSize } from '@visx/responsive'
import { AnimatedLineSeries, Axis, XYChart } from '@visx/xychart'
import dayjs from 'dayjs'
import { useMemo } from 'react'

import { customTheme } from '@/components/charts/custom-theme'
import { ChartPeriod } from '@/components/charts/types'
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
    xAccessor: (d: Pick<IndexData, 'NetAssetValue' | 'CreatedTimestamp'>) =>
      dayjs(d.CreatedTimestamp).format(timestampFormatByPeriod[selectedPeriod]),
    yAccessor: (d: Pick<IndexData, 'NetAssetValue' | 'CreatedTimestamp'>) =>
      d.NetAssetValue!.toFixed(2),
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
      <Axis orientation='bottom' numTicks={4} />
      <AnimatedLineSeries
        {...accessors}
        dataKey='prices'
        data={data}
        curve={curveBasis}
      />
    </XYChart>
  )
}

export default withParentSize(LineChart)
