import { TransactionResponse } from '@ethersproject/providers'
import { StoredTransaction } from '@usedapp/core'

// Returns a StoredTransaction for adding to tx history (of usedapp)
// https://usedapp-docs.netlify.app/docs/API%20Reference/Hooks#usetransactions
export function getStoredTransaction(
  tx: TransactionResponse
): StoredTransaction {
  const timestamp = Math.floor(Date.now() / 1000)
  return { transaction: tx, submittedAt: timestamp }
}
