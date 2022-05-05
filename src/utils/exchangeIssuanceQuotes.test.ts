import { BigNumber, ethers } from 'ethers'

import { GmiIndex } from 'constants/tokens'

import { getRequiredComponents } from './exchangeIssuanceQuotes'

const provider = new ethers.providers.JsonRpcProvider(
  process.env.REACT_APP_MAINNET_ALCHEMY_API,
  1
)
const signer = provider.getSigner('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')

describe('getRequiredComponents()', () => {
  test('should return components and positions for issuance', async () => {
    const isIssuance = true
    const setToken = GmiIndex.address
    const setTokenSymbol = GmiIndex.symbol
    const setTokenAmount = BigNumber.from(1)
    const chainId = 1

    const { positions, components } = await getRequiredComponents(
      isIssuance,
      setToken,
      setTokenSymbol,
      setTokenAmount,
      chainId,
      signer
    )

    expect(positions.length).toBeGreaterThan(0)
    expect(components.length).toBeGreaterThan(0)
    expect(positions.length).toEqual(components.length)
  })

  test('should return components and positions for redeeming', async () => {
    const isIssuance = false
    const setToken = GmiIndex.address
    const setTokenSymbol = GmiIndex.symbol
    const setTokenAmount = BigNumber.from(1)
    const chainId = 1

    const { positions, components } = await getRequiredComponents(
      isIssuance,
      setToken,
      setTokenSymbol,
      setTokenAmount,
      chainId,
      signer
    )

    expect(positions.length).toBeGreaterThan(0)
    expect(components.length).toBeGreaterThan(0)
    expect(positions.length).toEqual(components.length)
  })
})
