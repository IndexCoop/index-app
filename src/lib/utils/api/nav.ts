import { IndexApi } from './index-api'

export class NavProvider {
  async getNavPrice(tokenSymbol: string, chainId = 1): Promise<number> {
    const indexApi = new IndexApi()
    const symbol = tokenSymbol.replace(/-/g, '').toLowerCase()
    const path = `/${chainId}/${symbol}/nav`
    const res = await indexApi.get(path)
    return res.nav
  }
}
