export enum PreSaleStatus {
  ACTIVE,
  CLOSED_TARGET_MET,
  CLOSED_TARGET_NOT_MET,
  NOT_STARTED,
  TOKEN_LAUNCHED,
}

export type PreSaleToken = {
  status: PreSaleStatus
  symbol: string
  address: string | undefined
  decimals: number
  logo?: string
  infoLink?: string
  launchDate?: string
  description: string
  componentsFrom: string[]
  prtRewards: string
  targetFundraise: {
    quantity: string
    asset: string
  }
  startDate?: string
  timestampEndDate: number
  tvlLockedPresale?: string
}
