/* eslint-disable */
import { getApiV2Quote } from "./getApiV2Quote.ts";
import { getApiV2UserAddress } from "./getApiV2UserAddress.ts";
import { postApiV2Trade } from "./postApiV2Trade.ts";
import { postApiV2UserAddress } from "./postApiV2UserAddress.ts";

 export function userService() {
    return { getApiV2Quote, postApiV2Trade, getApiV2UserAddress, postApiV2UserAddress };
}