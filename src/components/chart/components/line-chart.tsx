import React, { useMemo, useCallback } from 'react'

import { Flex, Text } from '@chakra-ui/react'
import { AreaClosed, Line, Bar } from '@visx/shape'
import appleStock, { AppleStock } from '@visx/mock-data/lib/mocks/appleStock'
import { curveMonotoneX } from '@visx/curve'
import { GridRows } from '@visx/grid'
import { scaleTime, scaleLinear } from '@visx/scale'
import { withTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip'
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip'
import { localPoint } from '@visx/event'
import { LinearGradient } from '@visx/gradient'
import { max, extent, bisector } from '@visx/vendor/d3-array'
import { timeFormat } from '@visx/vendor/d3-time-format'

import { colors } from '@/lib/styles/colors'

type TooltipData = AppleStock

export const accentColor = '#05ACAF'
const formatDate = timeFormat('%b %d, %I:%M %p')
const stock = appleStock.slice(800)

// accessors
const getDate = (d: AppleStock) => new Date(d.date)
const getStockValue = (d: AppleStock) => d.close
const bisectDate = bisector<AppleStock, Date>((d) => new Date(d.date)).left

export type AreaProps = {
  width: number
  height: number
  margin?: { top: number; right: number; bottom: number; left: number }
}

export default withTooltip<AreaProps, TooltipData>(
  ({
    width,
    height,
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
  }: AreaProps & WithTooltipProvidedProps<TooltipData>) => {
    if (width < 10) return null

    // bounds
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // scales
    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [margin.left, innerWidth + margin.left],
          domain: extent(stock, getDate) as [Date, Date],
        }),
      [innerWidth, margin.left]
    )
    const stockValueScale = useMemo(
      () =>
        scaleLinear({
          range: [innerHeight + margin.top, margin.top],
          domain: [0, (max(stock, getStockValue) || 0) + innerHeight / 3],
          nice: true,
        }),
      [margin.top, innerHeight]
    )

    // tooltip handler
    const handleTooltip = useCallback(
      (
        event:
          | React.TouchEvent<SVGRectElement>
          | React.MouseEvent<SVGRectElement>
      ) => {
        const { x } = localPoint(event) || { x: 0 }
        const x0 = dateScale.invert(x)
        const index = bisectDate(stock, x0, 1)
        const d0 = stock[index - 1]
        const d1 = stock[index]
        let d = d0
        if (d1 && getDate(d1)) {
          d =
            x0.valueOf() - getDate(d0).valueOf() >
            getDate(d1).valueOf() - x0.valueOf()
              ? d1
              : d0
        }
        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: stockValueScale(getStockValue(d)),
        })
      },
      [showTooltip, stockValueScale, dateScale]
    )

    return (
      <div>
        <svg width={width} height={height}>
          <LinearGradient
            id='area-gradient'
            from={accentColor}
            fromOpacity={0.8}
            to={'#fff'}
            toOpacity={0.6}
            vertical={true}
          />
          <GridRows
            left={margin.left}
            scale={stockValueScale}
            width={innerWidth}
            strokeDasharray='1,3'
            stroke={accentColor}
            strokeOpacity={0}
            pointerEvents='none'
          />
          <AreaClosed<AppleStock>
            data={stock}
            x={(d) => dateScale(getDate(d)) ?? 0}
            y={(d) => stockValueScale(getStockValue(d)) ?? 0}
            yScale={stockValueScale}
            strokeWidth={2}
            stroke='url(#area-gradient)'
            fill='url(#area-gradient)'
            curve={curveMonotoneX}
          />
          <Bar
            x={margin.left}
            y={margin.top}
            width={innerWidth}
            height={innerHeight}
            fill='transparent'
            rx={14}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />
          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: margin.top }}
                to={{ x: tooltipLeft, y: innerHeight + margin.top }}
                stroke={colors.icGray2}
                strokeDasharray='2,4'
                strokeWidth={2}
                strokeLinecap='round'
                pointerEvents='none'
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill={colors.icGray8}
                fillOpacity={1}
                pointerEvents='none'
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={10}
                fill={colors.icGray8}
                fillOpacity={0.2}
                pointerEvents='none'
              />
            </g>
          )}
        </svg>
        {tooltipData && (
          <div>
            <TooltipWithBounds
              key={Math.random()}
              top={tooltipTop - 39}
              left={tooltipLeft + 4}
              style={{
                ...defaultStyles,
                background: '#fff',
                borderRadius: '8px',
                opacity: 0.9,
                padding: '10px',
              }}
            >
              <Flex direction={'column'} gap={1}>
                <Text
                  color={colors.icGray7}
                  fontSize={'lg'}
                  fontWeight={600}
                >{`$${getStockValue(tooltipData)}`}</Text>
                <Text
                  color={colors.icGray2}
                  fontSize={'xs'}
                  fontWeight={400}
                >{`${formatDate(getDate(tooltipData))}`}</Text>
              </Flex>
            </TooltipWithBounds>
          </div>
        )}
      </div>
    )
  }
)
