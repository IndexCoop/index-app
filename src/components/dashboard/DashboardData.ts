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
  JPGIndex,
  MetaverseIndex,
} from 'constants/tokens'
import { displayFromWei, toWei } from 'utils'

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
    { symbol: 'JPG', icon: JPGIndex.image },
  ],
}

function getPosition(
  title: string,
  balance: BigNumber | undefined,
  fiat: number,
  total: number,
  backgroundColor?: string
): Position | null {
  if (
    balance === undefined ||
    balance.isZero() ||
    balance.isNegative() ||
    // This will filter out some dust in the wallet
    fiat <= 0.01 ||
    total <= 0
  ) {
    return null
  }

  const percent = `${((fiat * 100) / total).toFixed(1)}%`
  const valueDisplay = displayFromWei(balance, 3) ?? ''

  return {
    title,
    backgroundColor: backgroundColor ?? '',
    color: '',
    percent,
    value: fiat,
    valueDisplay,
  }
}

function getOthersPosition(
  remainingPositions: Position[],
  totalBalance: number
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
    const initialVal = 0
    const initialBalance = BigNumber.from(0)
    const balanceOthers = remainingPositions.reduce(
      (prevValue, pos) => prevValue.add(toWei(pos.valueDisplay ?? '0')),
      initialBalance
    )
    const fiatOthers = remainingPositions.reduce(
      (prevValue, pos) => prevValue + pos.value,
      initialVal
    )
    othersPosition = getPosition(
      'OTHERS',
      balanceOthers,
      fiatOthers,
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
    balance: BigNumber
    fiat: number
  }[]
) {
  // Remove ETH from the pie chart
  balances = balances.filter((pos) => pos.title !== 'ETH')

  if (balances.length < 1) {
    return []
  }

  const totalBalance: number = balances
    .map((pos) => {
      return pos.fiat ?? 0
    })
    .reduce((prev, curr) => {
      return prev + curr
    })

  // Check balances of different products for user
  const positions = balances.flatMap((tempPosition) => {
    const position = getPosition(
      tempPosition.title,
      tempPosition.balance,
      tempPosition.fiat,
      totalBalance
    )
    if (position === null || tempPosition.balance === undefined) {
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
