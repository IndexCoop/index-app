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
  transactionType: string,
  transactionHash?: string,
  data?: any
) => {
  if (isDevEnv) return
  init()
    .then((arcxAnalyticsSdk) => {
      arcxAnalyticsSdk!.transaction(transactionType, transactionHash, data)
    })
    .catch((error) => {
      console.error(error)
    })
}

export const logTx = (txType: string, tx: TransactionResponse | null) => {
  if (!tx) logTransaction(txType, undefined, { status: 'NO_RESPONSE' })
  else logTransaction(txType, tx.hash)
}
