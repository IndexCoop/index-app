/* eslint-disable */
import client from "@/lib/axios";
import type { PostApiV2TradeMutationRequest, PostApiV2TradeMutationResponse, PostApiV2Trade400, PostApiV2Trade401, PostApiV2Trade403, PostApiV2Trade500 } from "../../../models/userController/PostApiV2Trade.ts";
import type { RequestConfig } from "@/lib/axios";

 /**
 * @description Persist a trade object a user has made
 * {@link /api/v2/trade}
 */
export async function postApiV2Trade(data: PostApiV2TradeMutationRequest, config: Partial<RequestConfig<PostApiV2TradeMutationRequest>> = {}) {
    const res = await client<PostApiV2TradeMutationResponse, PostApiV2Trade400 | PostApiV2Trade401 | PostApiV2Trade403 | PostApiV2Trade500, PostApiV2TradeMutationRequest>({ method: "POST", url: `/api/v2/trade`, baseURL: "https://api.indexcoop/v2", data, ...config });
    return res;
}