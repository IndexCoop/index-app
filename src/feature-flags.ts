export const isStakingEnabled = () =>
  process.env.NEXT_PUBLIC_VERCEL_ENV !== 'index-app-prod'
