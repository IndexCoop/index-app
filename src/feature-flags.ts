export const isLeverageSuiteEnabled = () => true

export const isExodusCampaignEnabled = () => true

export const isStakingEnabled = () =>
  process.env.NEXT_PUBLIC_VERCEL_ENV !== 'index-app-prod'
