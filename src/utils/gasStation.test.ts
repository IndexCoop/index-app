import { JsonRpcProvider } from '@ethersproject/providers'

import { GasStation, getGasApiUrl } from './gasStation'

const provider = new JsonRpcProvider(
  process.env.REACT_APP_MAINNET_ALCHEMY_API,
  1
)
// const providerOptimism = new JsonRpcProvider(
//   process.env.REACT_APP_OPTIMISM_ALCHEMY_API,
//   10
// )

describe('GasStation', () => {
  test('returns gas fees', async () => {
    let gasStation = new GasStation(provider)
    // const fees = await gasStation.getGasFees()
  })
})

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
