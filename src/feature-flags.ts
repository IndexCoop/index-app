export const isLeverageSuiteEnabled = () => true

export const isExodusCampaignEnabled = () =>
  process.env.NEXT_PUBLIC_VERCEL_ENV !== 'index-app-prod'
