import { getGasApiUrl } from './gasStation'

describe('getGasApiUrl()', () => {
  test('returns correct url', async () => {
    const expectedUrl = 'https://api.indexcoop.com/gas/mainnet'
    const url = getGasApiUrl()
    expect(url).toBe(expectedUrl)
  })

  test('returns correct url for polygon', async () => {
    const expectedUrl = 'https://api.indexcoop.com/gas/polygon'
    const url = getGasApiUrl(137)
    expect(url).toBe(expectedUrl)
  })
})
