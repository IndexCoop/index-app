import { extractPoolFees } from './UniswapPath'

describe('UniswapPath', () => {
  describe('extractPoolFees()', () => {
    test('should extract a fee for a single pool', async () => {
      const path =
        '0x2791bca1f2de4661ed88a30c99a7a9449aa841740001f47ceb23fd6bc0add59e62ac25578270cff1b9f619'
      const result = extractPoolFees(path)
      expect(result).toBeDefined()
      expect(result).toEqual([500])
    })

    test('should extract fees for multiple pools', async () => {
      const path =
        '0x8f3cf7ad23cd3cadbd9735aff958023239c6a0630001f47ceb23fd6bc0add59e62ac25578270cff1b9f6190001f42791bca1f2de4661ed88a30c99a7a9449aa84174'
      const result = extractPoolFees(path)
      expect(result).toBeDefined()
      expect(result).toEqual([500, 500])
    })
  })
})
