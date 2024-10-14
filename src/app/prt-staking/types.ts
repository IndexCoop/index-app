import { ListedToken } from '@nsorcell/exp-tokenlist'

export type ProductRevenueToken = {
  rewardTokenData: ListedToken
  stakeTokenData: ListedToken
  stakedTokenData: ListedToken
  description: string
  moreInfoUrl: string
}

export enum WidgetTab {
  STAKE = 'Stake',
  UNSTAKE = 'Unstake',
  CLAIM = 'Claim',
}
