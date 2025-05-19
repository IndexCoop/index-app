import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'

import { getFlashMintQuote } from './flashmint'

describe('getFlashmintQuote - redeeming', () => {
    it('returns input token amount directly', async () => {})
})

describe('getFlashmintQuote - minting', () => {
    // TODO: Set correct quote request
    const flashMintQuoteRequest = {
        account: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96040',
        chainId: 1,
        inputTokenAmountWei: BigInt(1_000_000_000),
        isMinting: true,
        inputToken: getTokenByChainAndSymbol(1, 'WETH'),
        outputToken: getTokenByChainAndSymbol(1, 'ETH2X'),
        inputTokenAmount: '1000000000',
        inputTokenPrice: 1000,
        outputTokenPrice: 1000,
        slippage: 0.05,
    }
    it('returns approx. index token amount', async () => {
        const result = await getFlashMintQuote(flashMintQuoteRequest)
        console.log("result", result)
    })
})
