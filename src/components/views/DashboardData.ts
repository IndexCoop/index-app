import { colors } from 'styles/colors'

import { BigNumber } from '@ethersproject/bignumber'

import { Position } from 'components/dashboard/AllocationChart'
import {
  BedIndex,
  Bitcoin2xFlexibleLeverageIndex,
  DataIndex,
  DefiPulseIndex,
  Ethereum2xFlexibleLeverageIndex,
  GmiIndex,
  icETHIndex,
  IndexToken,
  MetaverseIndex,
} from 'constants/tokens'
import { displayFromWei } from 'utils'

const chartColors = [
  colors.icApricot,
  colors.icBlue,
  colors.icPeriwinkle,
  colors.icLazurite,
  colors.icYellow,
]

export const QuickTradeData = {
  tokenList1: [
    { symbol: 'ETH', icon: '' },
    { symbol: 'DAI', icon: '' },
    { symbol: 'USDC', icon: '' },
  ],
  tokenList2: [
    { symbol: 'DPI', icon: DefiPulseIndex.image },
    { symbol: 'MVI', icon: MetaverseIndex.image },
    { symbol: 'BED', icon: BedIndex.image },
    { symbol: 'DATA', icon: DataIndex.image },
    { symbol: 'GMI', icon: GmiIndex.image },
    { symbol: 'ETHFLI', icon: Ethereum2xFlexibleLeverageIndex.image },
    { symbol: 'BTCFLI', icon: Bitcoin2xFlexibleLeverageIndex.image },
    { symbol: 'INDEX', icon: IndexToken.image },
    { symbol: 'icETH', icon: icETHIndex.image },
  ],
}

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

  const valueDisplay = displayFromWei(bigNumber, 3) ?? ''
  const value = getNumber(bigNumber)
  const percent = `${bigNumber.mul(100).div(total).toString()}%`

  return {
    title,
    backgroundColor: backgroundColor ?? '',
    color: '',
    percent,
    value,
    valueDisplay,
  }
}

function getOthersPosition(
  remainingPositions: Position[],
  totalBalance: BigNumber
) {
  let othersPosition: Position | null = null

  if (remainingPositions.length < 1) {
    return othersPosition
  }

  const lastColor = chartColors.slice(-1)[0]
  if (remainingPositions.length === 1) {
    othersPosition = remainingPositions[0]
    othersPosition.backgroundColor = lastColor
  } else {
    const initialVal = BigNumber.from(0)
    const sumOthers = remainingPositions.reduce(
      (prevValue, pos) => prevValue.add(BigNumber.from(pos.value)),
      initialVal
    )
    othersPosition = getPosition(
      'OTHERS',
      BigNumber.from(sumOthers),
      totalBalance,
      lastColor
    )
  }

  return othersPosition
}

// Gets 4 top positions and reduces rest to others
export function getPieChartPositions(
  balances: {
    title: string
    value: BigNumber | undefined
  }[]
) {
  // Remove ETH from the pie chart
  balances = balances.filter((pos) => pos.title !== 'ETH')

  if (balances.length < 1) {
    return []
  }

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

  const remainingPositions = sortedPositions.slice(4)
  let othersPosition: Position | null = getOthersPosition(
    remainingPositions,
    totalBalance
  )

  const pieChartPositions = [...top4PositionsWithColors]
  if (othersPosition !== null) {
    pieChartPositions.push(othersPosition)
  }

  return pieChartPositions
}
