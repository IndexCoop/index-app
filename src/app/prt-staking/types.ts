import { TokenData } from '@indexcoop/tokenlists'

export type ProductRevenueToken = {
  tokenData: TokenData
  prtTokenData: TokenData
  description: string
  moreInfoUrl: string
}

export enum WidgetTab {
  STAKE = 'Stake',
  UNSTAKE = 'Unstake',
  CLAIM = 'Claim',
}
