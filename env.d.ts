declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_ARCX_ANALYTICS_API_KEY: string
      NEXT_PUBLIC_ALCHEMY_ID: string
      NEXT_PUBLIC_INDEX_COOP_API: string
      NEXT_PUBLIC_IP_LOOKUP_KEY: string
      NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: string
      NEXT_PUBLIC_GOOGLE_TAG_MANAGER_CONTAINER_ID?: string
      NEXT_PUBLIC_TENDERLY_ACCESS_KEY: string
      NEXT_PUBLIC_TENDERLY_USER: string
      NEXT_PUBLIC_VERCEL_ENV:
        | 'index-app-prod'
        | 'index-app-staging'
        | 'development'
        | 'preview'
      NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: string
    }
  }
}

export {}
