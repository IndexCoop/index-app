export type VaultToken = {
  symbol: string
  description: string
  annualizedTargetReturn: string
  assets: string[]
  targetFundraise: {
    amount: number
    currency: string
  }
  minimumCommitment: {
    amount: number
    currency: string
  }
  portfolioTerm?: string
  lockupPeriod?: string
}
