/* eslint-disable */

 export const postApiV2Trade200StatusEnum = {
    "ok": "ok"
} as const;

 export type PostApiV2Trade200StatusEnum = (typeof postApiV2Trade200StatusEnum)[keyof typeof postApiV2Trade200StatusEnum];

 /**
 * @description Saved Trade Successfully Response
*/
export type PostApiV2Trade200 = {
    /**
     * @type string
    */
    status: PostApiV2Trade200StatusEnum;
};

 /**
 * @description Bad Request
*/
export type PostApiV2Trade400 = {
    /**
     * @type string
    */
    message: string;
};

 /**
 * @description Unauthorized
*/
export type PostApiV2Trade401 = {
    /**
     * @type string
    */
    message: string;
};

 /**
 * @description Forbidden
*/
export type PostApiV2Trade403 = {
    /**
     * @type string
    */
    message: string;
};

 /**
 * @description Internal Server Error
*/
export type PostApiV2Trade500 = {
    /**
     * @type string
    */
    message: string;
};

 /**
 * @description Trade
*/
export type PostApiV2TradeMutationRequest = {
    /**
     * @type string
    */
    transactionHash: string;
    /**
     * @type string
    */
    userAddress: string;
    /**
     * @type integer
    */
    chainId: number | null;
    /**
     * @type string
    */
    from: string | null;
    /**
     * @type string
    */
    to: string | null;
    /**
     * @type string
    */
    quoteType: string;
    /**
     * @type string
    */
    gasUnits: string;
    /**
     * @type string
    */
    gasPrice: string;
    /**
     * @type string
    */
    gasCost: string;
    /**
     * @type number
    */
    gasCostInUsd: number;
    /**
     * @type number
    */
    priceImpact: number | null;
    /**
     * @type string
    */
    inputTokenAddress: string;
    /**
     * @type string
    */
    inputTokenSymbol: string;
    /**
     * @type string
    */
    inputTokenUnits: string;
    /**
     * @type string
    */
    inputTokenAmountWei: string;
    /**
     * @type number
    */
    inputTokenAmountUsd: number;
    /**
     * @type number
    */
    inputTokenPriceUsd: number;
    /**
     * @type string
    */
    outputTokenAddress: string;
    /**
     * @type string
    */
    outputTokenSymbol: string;
    /**
     * @type string
    */
    outputTokenUnits: string;
    /**
     * @type string
    */
    outputTokenAmountWei: string;
    /**
     * @type number
    */
    outputTokenAmountUsd: number;
    /**
     * @type number
    */
    outputTokenPriceUsd: number;
    /**
     * @type number
    */
    slippage: number;
    /**
     * @type string
    */
    transactionType: string;
    /**
     * @type string
    */
    mintFee: string;
    /**
     * @type string
    */
    redeemFee: string;
    /**
     * @type string
    */
    refId: string | null;
    /**
     * @type string, date-time
    */
    createdAt: Date;
};

 export type PostApiV2TradeMutationResponse = PostApiV2Trade200;

 export type PostApiV2TradeMutation = {
    Response: PostApiV2Trade200;
    Request: PostApiV2TradeMutationRequest;
    Errors: PostApiV2Trade400 | PostApiV2Trade401 | PostApiV2Trade403 | PostApiV2Trade500;
};