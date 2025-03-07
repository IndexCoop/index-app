import { atomWithMachine } from 'jotai-xstate'
import { TransactionReceipt } from 'viem'
import { assertEvent, assign, createMachine } from 'xstate'

import { TransactionReview } from '@/components/swap/components/transaction-review/types'
import { QuoteResult, QuoteType } from '@/lib/hooks/use-best-quote/types'

import type { PostApiV2Trade200 } from '@/gen'

// Define the context type for our state machine
export interface TradeMachineContext {
  isModalOpen: boolean
  trade: PostApiV2Trade200 | null
  quoteResult: QuoteResult | null
  transactionReview: TransactionReview | null
  transactionStatus: TransactionReceipt['status'] | null
}

export type TradeMachineEvent =
  | { type: 'FETCHING_QUOTE' }
  | { type: 'QUOTE'; quoteResult: QuoteResult; quoteType: QuoteType }
  | { type: 'REVIEW' }
  | { type: 'SUBMIT' }
  | { type: 'TRADE_FAILED' }
  | { type: 'TRADE_SUCCESS'; trade: PostApiV2Trade200 }
  | { type: 'CLOSE' }
  | { type: 'RESET_DONE' }

export type TradeMachineAction = { type: 'resetContext' }

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
      quoteResult: null,
      trade: null,
      transactionReview: null,
      transactionStatus: null,
    },
    states: {
      idle: {
        on: {
          QUOTE: {
            target: 'quote',
            actions: assign({
              quoteResult: ({ event }) => event.quoteResult,
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
                    bestQuote: event.quoteType,
                    results: {
                      flashmint: null,
                      index: null,
                      issuance: null,
                      redemption: null,
                      [event.quoteType]: quoteResult,
                    },
                  },
                  selectedQuote: event.quoteType,
                }

                return transactionReview
              },
            }),
            guard: ({ event }) =>
              Boolean(event.quoteResult && event.quoteResult.quote),
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
            target: 'reset',
          },
        },
      },
      pending: {
        on: {
          TRADE_SUCCESS: {
            target: 'success',
            actions: assign({
              trade: ({ event }) => {
                return event.trade
              },
              transactionStatus: 'success',
            }),
          },
          TRADE_FAILED: {
            target: 'failed',
            actions: assign({
              transactionStatus: 'reverted',
            }),
          },
          CLOSE: {
            target: 'reset',
          },
        },
      },
      success: {
        on: {
          CLOSE: {
            target: 'reset',
          },
        },
      },
      failed: {
        on: {
          CLOSE: {
            target: 'reset',
          },
        },
      },
      reset: {
        on: {
          RESET_DONE: {
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
        quoteResult: null,
        trade: null,
        transactionReview: null,
        transactionStatus: null,
      }),
    },
  })

export const tradeMachineAtom = atomWithMachine(createTradeMachine)
