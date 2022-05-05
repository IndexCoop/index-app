import { BigNumber, ethers } from 'ethers'

import { ETH, GmiIndex, icETHIndex, MATIC } from 'constants/tokens'

import {
  getIncloudedSources,
  getLevEIPaymentTokenAddress,
  getRequiredComponents,
} from './exchangeIssuanceQuotes'

const provider = new ethers.providers.JsonRpcProvider(
  process.env.REACT_APP_MAINNET_ALCHEMY_API,
  1
)
const signer = provider.getSigner('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')

describe('getIncloudedSources()', () => {
  test('should return Curve only for icETH', async () => {
    const isIcEth = true
    const includedSources = getIncloudedSources(isIcEth)
    expect(includedSources).toBeDefined()
    expect(includedSources).toEqual('Curve')
  })

  test('should return all valid exchanges for any other token', async () => {
    const isIcEth = false
    const includedSources = getIncloudedSources(isIcEth)
    expect(includedSources).toBeDefined()
    expect(includedSources).toEqual('SushiSwap')
  })
})

describe('getLevEIPaymentTokenAddress()', () => {
  test('should return ETH for ETH', async () => {
    const paymentTokenAddress = getLevEIPaymentTokenAddress(ETH, true, 1)
    const paymentTokenAddress2 = getLevEIPaymentTokenAddress(ETH, false, 1)
    expect(paymentTokenAddress).toEqual('ETH')
    expect(paymentTokenAddress2).toEqual('ETH')
  })

  test('should return icETH address for issuing icETH', async () => {
    const paymentTokenAddress = getLevEIPaymentTokenAddress(icETHIndex, true, 1)
    expect(paymentTokenAddress).toEqual(icETHIndex.address)
  })

  test('should return stETH address for redeeming icETH', async () => {
    const paymentTokenAddress = getLevEIPaymentTokenAddress(
      icETHIndex,
      false,
      1
    )
    const stETH = '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84'
    expect(paymentTokenAddress).toEqual(stETH)
  })

  test('should return WMATIC address for MATIC on polygon', async () => {
    const paymentTokenAddress = getLevEIPaymentTokenAddress(MATIC, true, 137)
    const WMATIC = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'
    expect(paymentTokenAddress).toEqual(WMATIC)
  })

  test('should return token address based on chain id', async () => {
    const paymentTokenAddressEth = getLevEIPaymentTokenAddress(
      GmiIndex,
      true,
      1
    )
    const paymentTokenAddressPolygon = getLevEIPaymentTokenAddress(
      GmiIndex,
      true,
      137
    )
    expect(paymentTokenAddressEth).toEqual(GmiIndex.address)
    expect(paymentTokenAddressPolygon).toEqual(GmiIndex.polygonAddress)
  })
})

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
