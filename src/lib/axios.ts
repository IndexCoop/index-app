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
})

export type * from '@kubb/plugin-client/client'

export default axiosClient
