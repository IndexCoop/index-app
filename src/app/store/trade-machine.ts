import { TransactionReview } from '@/components/swap/components/transaction-review/types'
import type { PostApiV2Trade200 } from '@/gen'
import { QuoteResult, QuoteType } from '@/lib/hooks/use-best-quote/types'
import { atomWithMachine } from 'jotai-xstate'
import { TransactionReceipt } from 'viem'
import { assertEvent, assign, createMachine } from 'xstate'

// Define the context type for our state machine
export interface TradeMachineContext {
  isModalOpen: boolean
  trade: PostApiV2Trade200 | null
  transactionReview: TransactionReview | null
  transactionStatus: TransactionReceipt['status'] | null
  error: Error | null
}

// Define the events that can be sent to the machine
export type TradeMachineEvent =
  | { type: 'QUOTE'; quoteResult: QuoteResult }
  | { type: 'REVIEW' }
  | { type: 'SUBMIT' }
  | { type: 'TRADE_PENDING' }
  | { type: 'TRADE_FAILED' }
  | { type: 'TRADE_PERSISTED'; trade: PostApiV2Trade200 }
  | { type: 'CLOSE' }

export type TradeMachineAction = { type: 'resetContext' }

export type TradeMachineState =
  | 'idle'
  | 'review'
  | 'pending'
  | 'success'
  | 'failed'

const createTradeMachine = () =>
  createMachine({
    types: {} as {
      context: TradeMachineContext
      events: TradeMachineEvent
      actions: TradeMachineAction
    },
    id: 'trade',
    initial: 'idle',
    context: {
      isModalOpen: false,
      trade: null,
      transactionReview: null,
      transactionStatus: null,
      error: null,
    },
    states: {
      idle: {
        on: {
          QUOTE: {
            target: 'quote',
            actions: assign({
              transactionReview: ({ event }) => {
                assertEvent(event, 'QUOTE')

                const quoteResult = event.quoteResult
                const quote = quoteResult.quote

                if (!quote) return null

                const transactionReview: TransactionReview = {
                  ...quote,
                  contractAddress: quote.contract,
                  chainId: quote.chainId ?? 1,
                  quoteResults: {
                    bestQuote: QuoteType.flashmint,
                    results: {
                      flashmint: quoteResult,
                      index: null,
                      issuance: null,
                      redemption: null,
                    },
                  },
                  selectedQuote: QuoteType.flashmint,
                }

                console.log(transactionReview)

                return transactionReview
              },
            }),
          },
        },
      },
      quote: {
        on: {
          REVIEW: {
            target: 'review',
            actions: assign({
              isModalOpen: true,
            }),
          },
        },
      },
      review: {
        on: {
          SUBMIT: {
            target: 'pending',
          },
          CLOSE: {
            target: 'idle',
            actions: 'resetContext',
          },
        },
      },
      pending: {
        on: {
          TRADE_PERSISTED: {
            target: 'success',
            actions: ({ event }) => {
              assertEvent(event, 'TRADE_PERSISTED')

              return assign({
                trade: event.trade,
              })
            },
          },
          TRADE_FAILED: {
            target: 'failed',
          },
        },
      },
      success: {
        on: {
          CLOSE: {
            target: 'idle',
            actions: 'resetContext',
          },
        },
      },
      failed: {
        on: {
          CLOSE: {
            target: 'idle',
            actions: 'resetContext',
          },
        },
      },
    },
  }).provide({
    actions: {
      resetContext: assign({
        isModalOpen: false,
        trade: null,
        transactionReview: null,
        transactionStatus: null,
        error: null,
      }),
    },
  })

export const tradeMachineAtom = atomWithMachine(createTradeMachine)
