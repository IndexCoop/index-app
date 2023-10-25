import { getIndexApiHeaders, IndexApiBaseUrl } from '@/constants/server'

export class IndexApi {
  /**
   * Fetches path and returns a json.
   * @returns JSON on success or throws error.
   */
  async get(path: string) {
    try {
      const headers = getIndexApiHeaders()
      const resp = await fetch(`${IndexApiBaseUrl}${path}`, {
        headers,
      })
      return resp.json()
    } catch (error) {
      console.log('Error fetching Index API for path', path)
      console.log(error)
      throw error
    }
  }
}
