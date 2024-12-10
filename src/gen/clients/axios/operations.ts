/* eslint-disable */

 export const operations = {
    "get_api-v2": {
        "path": "/api/v2/",
        "method": "get"
    },
    "get_api-v2-quote": {
        "path": "/api/v2/quote",
        "method": "get"
    },
    "post_api-v2-trade": {
        "path": "/api/v2/trade",
        "method": "post"
    },
    "get_api-v2-user-address": {
        "path": "/api/v2/user/:address",
        "method": "get"
    },
    "post_api-v2-user-address": {
        "path": "/api/v2/user/:address",
        "method": "post"
    }
} as const;