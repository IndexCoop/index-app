/* eslint-disable */

 export type GetApiV2UserAddressPathParams = {
    /**
     * @type string
    */
    address: string;
};

 /**
 * @description User
*/
export type GetApiV2UserAddress200 = {
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
export type GetApiV2UserAddress400 = {
    /**
     * @type string
    */
    message: string;
};

 /**
 * @description Unauthorized
*/
export type GetApiV2UserAddress401 = {
    /**
     * @type string
    */
    message: string;
};

 /**
 * @description Forbidden
*/
export type GetApiV2UserAddress403 = {
    /**
     * @type string
    */
    message: string;
};

 /**
 * @description Not Found
*/
export type GetApiV2UserAddress404 = {
    /**
     * @type string
    */
    message: string;
};

 /**
 * @description Internal Server Error
*/
export type GetApiV2UserAddress500 = {
    /**
     * @type string
    */
    message: string;
};

 export type GetApiV2UserAddressQueryResponse = GetApiV2UserAddress200;

 export type GetApiV2UserAddressQuery = {
    Response: GetApiV2UserAddress200;
    PathParams: GetApiV2UserAddressPathParams;
    Errors: GetApiV2UserAddress400 | GetApiV2UserAddress401 | GetApiV2UserAddress403 | GetApiV2UserAddress404 | GetApiV2UserAddress500;
};