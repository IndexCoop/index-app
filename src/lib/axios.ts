import { axiosClient } from '@kubb/plugin-client/client'

const config = axiosClient.getConfig()

axiosClient.setConfig({
  ...config,
  method: config.method || 'GET',
  headers: {
    ...config.headers,
    'Content-Type': 'application/json',
    'x-api-key': process.env.INDEX_COOP_API_V2_KEY,
  },
  paramsSerializer: {
    indexes: null, // Serialize arrays as metrics=apy&metrics=price instead of metrics[0]=apy&metrics[1]=price
  },
} as Parameters<typeof axiosClient.setConfig>[0])

export type * from '@kubb/plugin-client/client'

export default axiosClient
