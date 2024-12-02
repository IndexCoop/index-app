/* eslint-disable */
import client from "@/lib/axios";
import type { GetApiV2UserAddressQueryResponse, GetApiV2UserAddressPathParams, GetApiV2UserAddress400, GetApiV2UserAddress401, GetApiV2UserAddress403, GetApiV2UserAddress404, GetApiV2UserAddress500 } from "../../../models/userController/GetApiV2UserAddress.ts";
import type { RequestConfig } from "@/lib/axios";

 /**
 * @description Get a user by address
 * {@link /api/v2/user/:address}
 */
export async function getApiV2UserAddress({ address }: {
    address: GetApiV2UserAddressPathParams["address"];
}, config: Partial<RequestConfig> = {}) {
    const res = await client<GetApiV2UserAddressQueryResponse, GetApiV2UserAddress400 | GetApiV2UserAddress401 | GetApiV2UserAddress403 | GetApiV2UserAddress404 | GetApiV2UserAddress500, unknown>({ method: "GET", url: `/api/v2/user/${address}`, baseURL: "https://api.indexcoop/v2", ...config });
    return res;
}