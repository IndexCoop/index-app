/* eslint-disable */
import client from "@/lib/axios";
import type { GetApiV2QueryResponse } from "../../models/GetApiV2.ts";
import type { RequestConfig } from "@/lib/axios";

 /**
 * @description Check if the server is alive
 * {@link /api/v2/}
 */
export async function getApiV2(config: Partial<RequestConfig> = {}) {
    const res = await client<GetApiV2QueryResponse, Error, unknown>({ method: "GET", url: `/api/v2/`, baseURL: "https://api-q513.onrender.com", ...config });
    return res;
}