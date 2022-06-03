import { TransactionResponse } from '@ethersproject/providers'
import { StoredTransaction } from '@usedapp/core'

// Returns a StoredTransaction for adding to tx history (of usedapp)
// https://usedapp-docs.netlify.app/docs/API%20Reference/Hooks#usetransactions
export function getStoredTransaction(
  tx: TransactionResponse,
  chainId: number = 1
): StoredTransaction {
  // Timestamp in milliseconds which usedapp uses internally with `sendTransaction`
  const timestamp = Date.now()
  tx.chainId = chainId
  return { transaction: tx, submittedAt: timestamp }
}
