import { getApiKey, IndexApiBaseUrl } from 'constants/server'

export class IndexApi {
  /**
   * Fetches path and returns a json.
   * @returns JSON on success or throws error.
   */
  async get(path: string) {
    console.log('GET', path)
    try {
      const key = getApiKey()
      const resp = await fetch(`${IndexApiBaseUrl}${path}`, {
        headers: {
          'X-INDEXCOOP-API-KEY': key,
        },
      })
      return resp.json()
    } catch (error) {
      console.log('Error fetching Index API for path', path)
      console.log(error)
      throw error
    }
  }
}
