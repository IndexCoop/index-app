import { TransactionResponse } from '@ethersproject/providers'
import { StoredTransaction } from '@usedapp/core'

// Returns a StoredTransaction for adding to tx history (of usedapp)
// https://usedapp-docs.netlify.app/docs/API%20Reference/Hooks#usetransactions
export function getStoredTransaction(
  tx: TransactionResponse,
  chainId: number = 1
): StoredTransaction {
  const timestamp = Math.floor(Date.now() / 1000)
  tx.chainId = chainId
  console.log('getting stored tx', tx.chainId, timestamp)
  return { transaction: tx, submittedAt: timestamp }
}
