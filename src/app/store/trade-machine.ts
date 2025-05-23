import { atomWithMachine } from 'jotai-xstate'
import { parseUnits, type TransactionReceipt } from 'viem'
import { assertEvent, assign, createMachine } from 'xstate'

import type { TransactionReview } from '@/components/swap/components/transaction-review/types'
import type { PostApiV2Trade200 } from '@/gen'
import type { QuoteResult, QuoteType } from '@/lib/hooks/use-best-quote/types'

// Define the context type for our state machine
export interface TradeMachineContext {
  isModalOpen: boolean
  quoteResult: QuoteResult | null
  quoteError: string
  trade: PostApiV2Trade200['trade'] | null
  position: PostApiV2Trade200['position'] | null
  transactionReview: TransactionReview | null
  transactionStatus: TransactionReceipt['status'] | null
}

export type TradeMachineEvent =
  | { type: 'INITIALIZE' }
  | { type: 'FETCHING_QUOTE' }
  | {
      type: 'QUOTE'
      quoteResult: QuoteResult
      quoteType: QuoteType
      inputValue?: string
    }
  | { type: 'QUOTE_NOT_FOUND'; reason: string }
  | { type: 'REVIEW' }
  | { type: 'SUBMIT' }
  | { type: 'TRADE_FAILED' }
  | { type: 'TRADE_SUCCESS'; result: PostApiV2Trade200 }
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
      position: null,
      transactionReview: null,
      transactionStatus: null,
      quoteError: '',
    },
    on: {
      INITIALIZE: {
        target: '.idle',
      },
    },
    states: {
      idle: {
        entry: 'resetContext',
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
                  inputTokenAmount: event.inputValue
                    ? parseUnits(event.inputValue, quote.inputToken.decimals)
                    : quote.inputTokenAmount,
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
          QUOTE_NOT_FOUND: {
            target: 'quoteNotFound',
            actions: assign({
              quoteError: ({ event }) => event.reason,
            }),
          },
        },
      },
      quote: {
        on: {
          FETCHING_QUOTE: {
            target: 'idle',
          },
          REVIEW: {
            target: 'review',
            actions: assign({
              isModalOpen: true,
            }),
          },
        },
      },
      quoteNotFound: {
        on: {
          FETCHING_QUOTE: {
            target: 'idle',
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
              position: ({ event }) => {
                return event.result.position
              },
              trade: ({ event }) => {
                return event.result.trade
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
        position: null,
        transactionReview: null,
        transactionStatus: null,
        quoteError: '',
      }),
    },
  })

export const tradeMachineAtom = atomWithMachine(createTradeMachine)
