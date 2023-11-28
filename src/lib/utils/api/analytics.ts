import { ArcxAnalyticsSdk } from '@arcxmoney/analytics'

const isDevEnv = process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'

const init = () => {
  return ArcxAnalyticsSdk.init(
    process.env.NEXT_PUBLIC_ARCX_ANALYTICS_API_KEY ?? '',
    { trackPages: true }
  )
}

export const logConnect = (address: string, chainId: number) => {
  if (isDevEnv) return
  init()
    .then((arcxAnalyticsSdk) => {
      arcxAnalyticsSdk!.wallet({
        account: address ?? '',
        chainId: chainId ?? '',
      })
    })
    .catch((error) => {
      console.error(error)
    })
}

export const logEvent = (event: string, data?: any) => {
  if (isDevEnv) return
  init()
    .then((arcxAnalyticsSdk) => {
      arcxAnalyticsSdk!.event(event, data)
    })
    .catch((error) => {
      console.error(error)
    })
}

export const logTransaction = (
  chainId: number,
  transactionType: string,
  transactionHash: string,
  data: any = {}
) => {
  if (isDevEnv) return
  init()
    .then((arcxAnalyticsSdk) => {
      arcxAnalyticsSdk.transaction({
        chainId: chainId,
        transactionHash: transactionHash,
        metadata: {
          data,
          transactionType,
        },
      })
    })
    .catch((error) => {
      console.log('Error logging transaction via arcx', error)
    })
}

export const logTx = (chainId: number, txType: string, hash: string) => {
  if (!hash) logTransaction(chainId, txType, '', { status: 'NO_RESPONSE' })
  else logTransaction(chainId, txType, hash)
}
