import {
  ExchangeIssuanceZeroExMainnetAddress,
  ExchangeIssuanceZeroExPolygonAddress,
} from 'constants/ethContractAddresses'

import { get0xExchangeIssuanceContract } from './contracts'

describe('get0xExchangeIssuanceContract()', () => {
  test('return correct address for polygon', async () => {
    const expectedAddress = ExchangeIssuanceZeroExPolygonAddress
    const address = get0xExchangeIssuanceContract(137)
    expect(address).toEqual(expectedAddress)
  })

  test('return correct address for mainnet', async () => {
    const expectedAddress = ExchangeIssuanceZeroExMainnetAddress
    const address = get0xExchangeIssuanceContract(1)
    expect(address).toEqual(expectedAddress)
  })
})
