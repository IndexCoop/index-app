/* eslint-disable */

 export type PostApiV2UserAddressPathParams = {
    /**
     * @type string
    */
    address: string;
};

 /**
 * @description User
*/
export type PostApiV2UserAddress200 = {
    /**
     * @type string
    */
    address: string;
    /**
     * @type string, date-time
    */
    last_connected: Date | null;
};

 /**
 * @description Bad Request
*/
export type PostApiV2UserAddress400 = {
    /**
     * @type string
    */
    message: string;
};

 /**
 * @description Unauthorized
*/
export type PostApiV2UserAddress401 = {
    /**
     * @type string
    */
    message: string;
};

 /**
 * @description Forbidden
*/
export type PostApiV2UserAddress403 = {
    /**
     * @type string
    */
    message: string;
};

 /**
 * @description Not Found
*/
export type PostApiV2UserAddress404 = {
    /**
     * @type string
    */
    message: string;
};

 /**
 * @description Internal Server Error
*/
export type PostApiV2UserAddress500 = {
    /**
     * @type string
    */
    message: string;
};

 export type PostApiV2UserAddressMutationRequest = object;

 export type PostApiV2UserAddressMutationResponse = PostApiV2UserAddress200;

 export type PostApiV2UserAddressMutation = {
    Response: PostApiV2UserAddress200;
    Request: PostApiV2UserAddressMutationRequest;
    PathParams: PostApiV2UserAddressPathParams;
    Errors: PostApiV2UserAddress400 | PostApiV2UserAddress401 | PostApiV2UserAddress403 | PostApiV2UserAddress404 | PostApiV2UserAddress500;
};