/* eslint-disable */

 export type GetApiV2QuoteQueryParams = {
    /**
     * @type string
    */
    chainId: string;
    /**
     * @type string
    */
    account: string;
    /**
     * @type string
    */
    inputToken: string;
    /**
     * @type string
    */
    outputToken: string;
    /**
     * @type string | undefined
    */
    inputAmount?: string;
    /**
     * @type string | undefined
    */
    outputAmount?: string;
    /**
     * @type string
    */
    slippage: string;
};

 export const getApiV2Quote200TypeEnum = {
    "flashmint": "flashmint"
} as const;

 export type GetApiV2Quote200TypeEnum = (typeof getApiV2Quote200TypeEnum)[keyof typeof getApiV2Quote200TypeEnum];

 /**
 * @description Quote Response
*/
export type GetApiV2Quote200 = {
    /**
     * @type string
    */
    type: GetApiV2Quote200TypeEnum;
    /**
     * @type number
    */
    chainId: number;
    /**
     * @type string
    */
    contract: string;
    /**
     * @type number
    */
    contractType: number;
    /**
     * @type string
    */
    takerAddress: string;
    /**
     * @type boolean
    */
    isMinting: boolean;
    /**
     * @type object
    */
    inputToken: {
        /**
         * @type string
        */
        address: string;
        /**
         * @type string
        */
        symbol: string;
        /**
         * @type number
        */
        decimals: number;
    };
    /**
     * @type object
    */
    outputToken: {
        /**
         * @type string
        */
        address: string;
        /**
         * @type string
        */
        symbol: string;
        /**
         * @type number
        */
        decimals: number;
    };
    /**
     * @type string
    */
    indexTokenAmount: string;
    /**
     * @type string
    */
    inputAmount: string;
    /**
     * @type string
    */
    outputAmount: string;
    /**
     * @type number
    */
    slippage: number;
    /**
     * @type object
    */
    transaction: {
        [key: string]: any;
    };
};

 /**
 * @description Bad Request
*/
export type GetApiV2Quote400 = {
    /**
     * @type string
    */
    message: string;
};

 /**
 * @description Unauthorized
*/
export type GetApiV2Quote401 = {
    /**
     * @type string
    */
    message: string;
};

 /**
 * @description Not Found
*/
export type GetApiV2Quote404 = {
    /**
     * @type string
    */
    message: string;
};

 /**
 * @description Internal Server Error
*/
export type GetApiV2Quote500 = {
    /**
     * @type string
    */
    message: string;
};

 export type GetApiV2QuoteQueryResponse = GetApiV2Quote200;

 export type GetApiV2QuoteQuery = {
    Response: GetApiV2Quote200;
    QueryParams: GetApiV2QuoteQueryParams;
    Errors: GetApiV2Quote400 | GetApiV2Quote401 | GetApiV2Quote404 | GetApiV2Quote500;
};