import { useEffect, useState } from 'react'

import { useTransactions } from '@usedapp/core'

export enum PendingTransactionState {
  none,
  pending,
  failed,
  success,
}

export const useWaitForTransaction = () => {
  // Status is rechecked on every new block
  // https://usedapp-docs.netlify.app/docs/API%20Reference/Hooks#usetransactions
  const { transactions } = useTransactions()

  const [pendingTxHash, setPendingTxHash] = useState<string | null>(null)
  const [pendingTxState, setPendingTxState] = useState(
    PendingTransactionState.none
  )

  useEffect(() => {
    const today = new Date()
    const latestTransactions = transactions
      // TODO: simulate states via manipulating here?
      .filter((tx) => {
        const txDate = new Date(tx.submittedAt)
        console.log(txDate.getDate(), txDate.getMonth(), txDate.getFullYear())
        return (
          txDate.getDate() === today.getDate() &&
          txDate.getMonth() === today.getMonth() &&
          txDate.getFullYear() === today.getFullYear()
        )
      })
      .sort((tx1, tx2) => tx1.submittedAt - tx2.submittedAt)
      .reverse()
    const latestTx = latestTransactions[0]
    console.log('///', transactions.length, latestTransactions.length)
    console.log(latestTx)
    console.log(transactions)

    if (!latestTx) {
      setPendingTxHash(null)
      setPendingTxState(PendingTransactionState.none)
      return
    }

    const txReceipt = latestTx.receipt

    if (!txReceipt) {
      setPendingTxHash(null)
      setPendingTxState(PendingTransactionState.pending)
      return
    }

    const txHash = latestTx.transaction.hash
    const state =
      txReceipt.status === 1
        ? PendingTransactionState.success
        : PendingTransactionState.failed
    setPendingTxHash(txHash)
    setPendingTxState(state)
  }, [transactions])

  return { pendingTxHash, pendingTxState }
}
