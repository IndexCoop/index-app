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
  transactionReview: TransactionReview | null
  transactionStatus: TransactionReceipt['status'] | null
  error: Error | null
}

export type TradeMachineEvent =
  | { type: 'FETCHING_QUOTE' }
  | { type: 'QUOTE'; quoteResult: QuoteResult; quote: QuoteType }
  | { type: 'REVIEW' }
  | { type: 'SUBMIT' }
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
                    bestQuote: event.quote,
                    results: {
                      flashmint: null,
                      index: null,
                      issuance: null,
                      redemption: null,
                      [event.quote]: quoteResult,
                    },
                  },
                  selectedQuote: QuoteType.flashmint,
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
            target: 'idle',
            actions: 'resetContext',
          },
        },
      },
      pending: {
        on: {
          TRADE_PERSISTED: {
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
