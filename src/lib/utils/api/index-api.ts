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
      console.warn('Error fetching Index API for path', path)
      console.log(error)
      throw error
    }
  }

  async put(path: string, data: Record<string, unknown>) {
    try {
      const headers = getIndexApiHeaders()
      const resp = await fetch(`${IndexApiBaseUrl}${path}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      })
      return resp.json()
    } catch (error) {
      console.warn('Error putting Index API for path', path)
      console.log(error)
      throw error
    }
  }
}
