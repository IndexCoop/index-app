import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

import { getAlchemyBaseUrl } from '@/lib/utils/urls'

import { getFlashMintQuote } from './flashmint'

import type { Quote } from '@/lib/hooks/use-best-quote/types'

describe('getFlashmintQuote - redeeming', () => {
  it('returns input token amount directly', async () => {})
})

describe('getFlashmintQuote - minting', () => {
  let originalFetch: any
  beforeAll(() => {
    originalFetch = global.fetch
    global.fetch = jest.fn()
  })

  const inputToken = getTokenByChainAndSymbol(1, 'WETH')
  const outputToken = getTokenByChainAndSymbol(1, 'ETH2X')
  const flashMintQuoteRequest = {
    account: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96040',
    chainId: 1,
    inputTokenAmountWei: BigInt('1000000000000000000'),
    isMinting: true,
    inputToken: { ...inputToken, image: inputToken.logoURI },
    outputToken: { ...outputToken, image: outputToken.logoURI },
    inputTokenAmount: '1',
    inputTokenPrice: 1000,
    outputTokenPrice: 1000,
    slippage: 0.5,
  }

  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(
      `${getAlchemyBaseUrl(1)}${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
    ),
  })

  it('returns approx. index token amount', async () => {
    // eslint-disable-next-line no-extra-semi
    ;(global.fetch as jest.Mock).mockImplementation(
      async (originalUrl, request) => {
        // console.log('originalUrl', originalUrl)
        // console.log('request', request)
        if (request.body) {
          // console.log('body', JSON.parse(request.body))
        }
        const url = originalUrl.startsWith('http')
          ? originalUrl
          : `https://app.indexcoop.com${originalUrl}`
        // console.log('url', url)
        const response = await originalFetch(url, request)
        // console.log('response', response)
        return response
      },
    )
    const result = await getFlashMintQuote(flashMintQuoteRequest, publicClient)

    if (!result) fail()

    const inputAmount: bigint = (result as Quote).inputTokenAmount
    console.log('result', inputAmount)
    const targetInputAmount: bigint = flashMintQuoteRequest.inputTokenAmountWei * (BigInt(10000) - BigInt(flashMintQuoteRequest.slippage * 100)) / BigInt(10000)
    const toleranceBP =  5;
    console.log('targetInputAmount', targetInputAmount);
    const lowerBound = targetInputAmount * (BigInt(10000 - toleranceBP)) / BigInt(10000);
    console.log('lowerBound', lowerBound);
    const upperBound = targetInputAmount * (BigInt(10000 + toleranceBP)) / BigInt(10000);
    console.log('upperBound', upperBound);
    expect(inputAmount < upperBound);
    expect(inputAmount > lowerBound);
  }, 50000)
})
