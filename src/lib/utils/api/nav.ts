import { IndexApi } from './index-api'

export class NavProvider {
  async getNavPrice(tokenSymbol: string): Promise<number> {
    const indexApi = new IndexApi()
    const symbol = tokenSymbol.replace(/-/g, '').toLowerCase()
    const path = `/${symbol}/nav`
    const res = await indexApi.get(path)
    return res.nav
  }
}
