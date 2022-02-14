import { BigNumber } from '@ethersproject/bignumber'

import { calculateApyStakingRewardV2 } from './LiquidityMiningProvider'

describe('calculateApyStakingRewardV2()', () => {
  test('should return APY to one decimal place', () => {
    const result = calculateApyStakingRewardV2({
      rewardsForDuration: BigNumber.from('12499999999999997760000'),
      rewardsPrice: 9.481926649490067,
      stakedPrice: 69.93589943442063,
      stakedTotalSupply: BigNumber.from('21435781091489154175540'),
    })

    expect(result).toBe('94.8')
  })
  test('should return default 0.0 if any values missing', () => {
    const result = calculateApyStakingRewardV2({
      rewardsForDuration: BigNumber.from('12499999999999997760000'),
      rewardsPrice: 0,
      stakedPrice: 69.93589943442063,
      stakedTotalSupply: BigNumber.from('21435781091489154175540'),
    })

    expect(result).toBe('0.0')
  })
})
