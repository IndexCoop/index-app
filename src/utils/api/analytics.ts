import { ArcxAnalyticsSdk } from '@arcxmoney/analytics'
import { TransactionResponse } from '@ethersproject/abstract-provider'

const init = () => {
  return ArcxAnalyticsSdk.init(
    process.env.REACT_APP_ARCX_ANALYTICS_API_KEY ?? ''
  )
}

const isDevEnv = process.env.REACT_APP_VERCEL_ENV === 'development'

export const logConnect = (address: string, chainId: number) => {
  if (isDevEnv) return
  init()
    .then((arcxAnalyticsSdk) => {
      arcxAnalyticsSdk!.connectWallet({
        account: address ?? '',
        chain: chainId ?? '',
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

export const logPage = (url: string) => {
  if (isDevEnv) return
  init()
    .then((arcxAnalyticsSdk) => {
      arcxAnalyticsSdk!.page({ url })
    })
    .catch((error) => {
      console.error(error)
    })
}

export const logTransaction = (
  chainId: number,
  transactionType: string,
  transactionHash?: string,
  data?: any
) => {
  if (isDevEnv) return
  init()
    .then((arcxAnalyticsSdk) => {
      arcxAnalyticsSdk.transaction({
        chain: chainId,
        transactionHash: transactionHash ?? '',
        metadata: {
          data,
          transactionType,
        },
      })
    })
    .catch((error) => {
      console.error(error)
    })
}

export const logTx = (
  chainId: number,
  txType: string,
  tx: TransactionResponse | null
) => {
  if (!tx) logTransaction(chainId, txType, undefined, { status: 'NO_RESPONSE' })
  else logTransaction(chainId, txType, tx.hash)
}
