import { getFlashmintQuote } from './flashmint'

describe('getFlashmintQuote - redeeming', () => {
    it('returns input token amount directly', async () => {})
})

describe('getFlashmintQuote - minting', () => {
    // TODO: Set correct quote request
    let flashMintQuoteRequest = {}
    it('returns approx. index token amount', async () => {
        let result = await getFlashmintQuote(flashMintQuoteRequest)
        console.log(result)
    })
})
