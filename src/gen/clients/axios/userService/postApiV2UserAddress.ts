/* eslint-disable */
import client from "@/lib/axios";
import type { PostApiV2UserAddressMutationRequest, PostApiV2UserAddressMutationResponse, PostApiV2UserAddressPathParams, PostApiV2UserAddress400, PostApiV2UserAddress401, PostApiV2UserAddress403, PostApiV2UserAddress404, PostApiV2UserAddress500 } from "../../../models/userController/PostApiV2UserAddress.ts";
import type { RequestConfig } from "@/lib/axios";

 /**
 * @description Create a new user / Update an existing user
 * {@link /api/v2/user/:address}
 */
export async function postApiV2UserAddress({ address }: {
    address: PostApiV2UserAddressPathParams["address"];
}, data?: PostApiV2UserAddressMutationRequest, config: Partial<RequestConfig<PostApiV2UserAddressMutationRequest>> = {}) {
    const res = await client<PostApiV2UserAddressMutationResponse, PostApiV2UserAddress400 | PostApiV2UserAddress401 | PostApiV2UserAddress403 | PostApiV2UserAddress404 | PostApiV2UserAddress500, PostApiV2UserAddressMutationRequest>({ method: "POST", url: `/api/v2/user/${address}`, baseURL: "https://api.indexcoop/v2", data, ...config });
    return res;
}