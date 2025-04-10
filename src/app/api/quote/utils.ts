export interface FlashMintQuoteRequest {
  chainId: number
  account: string
  inputToken: string
  outputToken: string
  inputAmount: string
  outputAmount: string
  slippage: number
}

export async function getQuote(quoteRequest: Record<string, string>) {
  const query = new URLSearchParams(quoteRequest).toString()
  const url = `https://api.indexcoop.com/v2/quote?${query}`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.INDEX_COOP_API_V2_KEY,
    } as HeadersInit,
  })

  const quote = await response.json()
  return quote
}
