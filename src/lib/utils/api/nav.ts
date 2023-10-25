import { IndexApi } from './index-api'

export class NavProvider {
  async getNavPrice(tokenSymbol: string): Promise<number> {
    const indexApi = new IndexApi()
    const path = `/${tokenSymbol.toLowerCase()}/nav`
    const res = await indexApi.get(path)
    return res.nav
  }
}
