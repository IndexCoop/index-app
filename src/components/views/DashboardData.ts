import { colors } from 'styles/colors'

import { BigNumber } from '@ethersproject/bignumber'

import { Position } from 'components/dashboard/AllocationChart'

const chartColors = [
  colors.icApricot,
  colors.icBlue,
  colors.icPeriwinkle,
  colors.icLazurite,
  colors.icYellow,
]

function getNumber(balance: BigNumber | undefined): number {
  if (balance === undefined) return -1
  return parseInt(balance.toString())
}

function getPosition(
  title: string,
  bigNumber: BigNumber | undefined,
  total: BigNumber,
  backgroundColor?: string
): Position | null {
  if (
    bigNumber === undefined ||
    bigNumber.isZero() ||
    bigNumber.isNegative() ||
    total.isZero() ||
    total.isNegative()
  ) {
    return null
  }

  const value = getNumber(bigNumber)
  const percent = `${bigNumber.mul(100).div(total).toString()}%`

  return {
    title,
    backgroundColor: backgroundColor ?? '',
    color: '',
    percent,
    value,
  }
}

export function getPieChartPositions(
  balances: {
    title: string
    value: BigNumber | undefined
  }[]
) {
  const totalBalance: BigNumber = balances
    .map((pos) => {
      return pos.value ?? BigNumber.from('0')
    })
    .reduce((prev, curr) => {
      return prev.add(curr)
    })

  // Check balances of different products for user
  const positions = balances.flatMap((tempPosition) => {
    const position = getPosition(
      tempPosition.title,
      tempPosition.value,
      totalBalance
    )
    if (position === null || tempPosition.value === undefined) {
      return []
    }
    return [position]
  })

  // Sort by top positions
  const sortedPositions = positions.sort(
    (pos1, pos2) => pos2.value - pos1.value
  )

  // Take top 4 positions and assign colors
  const top4Positions = sortedPositions.slice(0, 4)
  const top4PositionsWithColors = top4Positions.map((position, index) => {
    let positionWithColor = position
    positionWithColor.backgroundColor = chartColors[index]
    return positionWithColor
  })

  // TODO: take all other balances and reduce to 'Others' position
  const othersPosition = getPosition(
    'OTHERS',
    BigNumber.from(100),
    totalBalance,
    chartColors.slice(-1)[0]
  )

  const pieChartPositions = [...top4PositionsWithColors]
  if (othersPosition !== null) {
    pieChartPositions.push(othersPosition)
  }

  return pieChartPositions
}
