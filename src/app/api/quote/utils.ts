import { getApiV2Quote, GetApiV2QuoteQueryParams } from '@/gen'

export interface FlashMintQuoteRequest extends GetApiV2QuoteQueryParams {}

export async function getQuote(quoteRequest: FlashMintQuoteRequest) {
  const response = await getApiV2Quote(quoteRequest)

  return response.data
}
