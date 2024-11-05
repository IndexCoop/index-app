import {
  CoinDeskEthTrendIndex,
  DefiPulseIndex,
  ic21,
  IndexCoopBitcoin2xIndex,
  IndexCoopEthereum2xIndex,
  IndexToken,
  LeveragedRethStakingYield,
} from '@/constants/tokens'

import { isAvailableForFlashMint, isAvailableForSwap } from './available'

describe('isAvailableForFlashMint()', () => {
  test('returns true by default', async () => {
    const isAvailable = isAvailableForFlashMint(CoinDeskEthTrendIndex)
    expect(isAvailable).toBe(true)
  })

  test('should return true for ic21 swap availability', async () => {
    const isAvailable = isAvailableForFlashMint(ic21)
    expect(isAvailable).toBe(true)
  })

  test('should return false for INDEX swap availability', async () => {
    const isAvailable = isAvailableForFlashMint(IndexToken)
    expect(isAvailable).toBe(false)
  })
})

describe('isAvailableForSwap()', () => {
  test('returns true by default', async () => {
    const isAvailable = isAvailableForFlashMint(DefiPulseIndex)
    expect(isAvailable).toBe(true)
  })

  test('should return false for BTC2x swap availability', async () => {
    const isAvailable = isAvailableForSwap(IndexCoopBitcoin2xIndex)
    expect(isAvailable).toBe(false)
  })

  test('should return false for cdETI swap availability', async () => {
    const isAvailable = isAvailableForSwap(CoinDeskEthTrendIndex)
    expect(isAvailable).toBe(false)
  })

  test('should return false for ETH2x swap availability', async () => {
    const isAvailable = isAvailableForSwap(IndexCoopEthereum2xIndex)
    expect(isAvailable).toBe(true)
  })

  test('should return false for icRETH swap availability', async () => {
    const isAvailable = isAvailableForSwap(LeveragedRethStakingYield)
    expect(isAvailable).toBe(false)
  })
})
