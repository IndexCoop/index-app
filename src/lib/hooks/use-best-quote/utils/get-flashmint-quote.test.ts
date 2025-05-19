import { formatWei, parseUnits } from '@/lib/utils'

import { getFlashmintQuote } from './flashmint'

describe('getFlashmintQuote - redeeming', () => {
    it('returns input token amount directly', async () => {})
})

describe('getFlashmintQuote - minting', () => {
    let flashMintQuoteRequest = {}
    it('returns approx. index token amount', async () => {
        let result = await getFlashmintQuote(flashMintQuoteRequest)
        console.log(result)
    })
})
