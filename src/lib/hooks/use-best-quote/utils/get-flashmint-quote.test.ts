import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

import { getAlchemyBaseUrl } from '@/lib/utils/urls'

import { getFlashMintQuote } from './flashmint'

describe('getFlashmintQuote - redeeming', () => {
  it('returns input token amount directly', async () => {})
})

describe('getFlashmintQuote - minting', () => {
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
    const result = await getFlashMintQuote(flashMintQuoteRequest, publicClient)
    console.log('result', result)
  })
})
