export enum PreSaleStatus {
  ACTIVE = 'active',
  NOT_STARTED = 'not-started',
}

export type PreSaleToken = {
  status: PreSaleStatus
  symbol: string
  logo?: string
  infoLink?: string
  description: string
  componentsFrom: string[]
  prtRewards: string
  indexRewards: number
  targetFundraise: number
  totalValueLocked: number
  timeLeftDays: number
  timestampEndDate: number
}
