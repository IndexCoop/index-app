/* eslint-disable */

 export const getApiV2200StatusEnum = {
    "ok": "ok"
} as const;

 export type GetApiV2200StatusEnum = (typeof getApiV2200StatusEnum)[keyof typeof getApiV2200StatusEnum];

 /**
 * @description Heartbeat Response
*/
export type GetApiV2200 = {
    /**
     * @type string
    */
    status: GetApiV2200StatusEnum;
};

 export type GetApiV2QueryResponse = GetApiV2200;

 export type GetApiV2Query = {
    Response: GetApiV2200;
    Errors: any;
};