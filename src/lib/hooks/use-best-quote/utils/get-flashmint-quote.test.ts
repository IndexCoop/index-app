import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

import { getAlchemyBaseUrl } from '@/lib/utils/urls'

import { getFlashMintQuote } from './flashmint'

describe('getFlashmintQuote - redeeming', () => {
  it('returns input token amount directly', async () => {})
})

describe('getFlashmintQuote - minting', () => {
  beforeAll(() => {
    global.fetch = jest.fn()
  })

  // TODO: Set correct quote request
  const inputToken = getTokenByChainAndSymbol(1, 'WETH')
  const outputToken = getTokenByChainAndSymbol(1, 'ETH2X')
  const flashMintQuoteRequest = {
    account: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96040',
    chainId: 1,
    inputTokenAmountWei: BigInt(1_000_000_000),
    isMinting: true,
    inputToken: { ...inputToken, image: inputToken.logoURI },
    outputToken: { ...outputToken, image: outputToken.logoURI },
    inputTokenAmount: '1000000000',
    inputTokenPrice: 1000,
    outputTokenPrice: 1000,
    slippage: 0.05,
  }

  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(
      `${getAlchemyBaseUrl(1)}${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
    ),
  })

  it('returns approx. index token amount', async () => {
    const mockResponse = {
      type: 'flashmint',
      chainId: 8453,
      contract: '0xE6c18c4C9FC6909EDa546649EBE33A8159256CBE',
      contractType: 3,
      takerAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      isMinting: true,
      inputToken: {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        symbol: 'ETH',
        decimals: 18,
      },
      outputToken: {
        address: '0x329f6656792c7d34D0fBB9762FA9A8F852272acb',
        symbol: 'ETH3X',
        decimals: 18,
      },
      indexTokenAmount: '1000000000000000000',
      inputAmount: '96932806209818442',
      outputAmount: '1000000000000000000',
      quoteAmount: '96448142178769350',
      slippage: 0.5,
      fees: {
        mint: 0.001,
        mintUsd: 0,
        redeem: 0.001,
        redeemUsd: 0,
        streaming: 0.0548,
        streamingUsd: 0,
      },
      transaction: {
        to: '0xE6c18c4C9FC6909EDa546649EBE33A8159256CBE',
        data: '0xf875572d000000000000000000000000329f6656792c7d34d0fbb9762fa9a8f852272acb0000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000002000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda029130000000000000000000000004200000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000001f4000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        value: {
          type: 'BigNumber',
          hex: '0x01585fdfa937cf4a',
        },
      },
    }
    ;(global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      }),
    )

    const result = await getFlashMintQuote(flashMintQuoteRequest, publicClient)
    console.log('result', result)
  })
})
