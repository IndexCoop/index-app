export enum PreSaleStatus {
  ACTIVE = 'active',
  NOT_STARTED = 'not-started',
}

export type PreSaleToken = {
  status: PreSaleStatus
  symbol: string
  logo?: string
  description: string
  componentsFrom: string[]
  prtRewards: number
  indexRewards: number
  targetFundraise: number
  totalValueLocked: number
  timeLeftDays: number
}
