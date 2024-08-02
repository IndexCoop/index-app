import { TokenData } from '@indexcoop/tokenlists'

export type ProductRevenueToken = {
  rewardTokenData: TokenData
  stakeTokenData: TokenData
  stakedTokenData: TokenData
  description: string
  moreInfoUrl: string
}

export enum WidgetTab {
  STAKE = 'Stake',
  UNSTAKE = 'Unstake',
  CLAIM = 'Claim',
}
