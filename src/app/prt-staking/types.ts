import { ListedToken } from '@indexcoop/tokenlists'

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
