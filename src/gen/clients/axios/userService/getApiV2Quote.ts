/* eslint-disable */
import client from "@/lib/axios";
import type { GetApiV2QuoteQueryResponse, GetApiV2QuoteQueryParams, GetApiV2Quote400, GetApiV2Quote401, GetApiV2Quote404, GetApiV2Quote500 } from "../../../models/userController/GetApiV2Quote.ts";
import type { RequestConfig } from "@/lib/axios";

 /**
 * @description Request a quote for a trade
 * {@link /api/v2/quote}
 */
export async function getApiV2Quote(params: GetApiV2QuoteQueryParams, config: Partial<RequestConfig> = {}) {
    const res = await client<GetApiV2QuoteQueryResponse, GetApiV2Quote400 | GetApiV2Quote401 | GetApiV2Quote404 | GetApiV2Quote500, unknown>({ method: "GET", url: `/api/v2/quote`, baseURL: "https://api-q513.onrender.com", params, ...config });
    return res;
}