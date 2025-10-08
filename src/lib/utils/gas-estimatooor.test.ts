import { Address, createPublicClient, http, parseUnits } from 'viem'

import { GasEstimatooor, GasEstimatooorFailedError } from './gas-estimatooor'

const DefaultGasLimitFlashMintZeroEx = 5_000_000

// Hardhat Account #0
const signer = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

const publicClient = createPublicClient({
  transport: http('http://127.0.0.1:8545/'),
})

describe('GasEstimatooor', () => {
  beforeEach((): void => {
    jest.setTimeout(10000)
  })

  it('should return default estimate for undefined tx', async () => {
    const defaultGasEstimate = BigInt(DefaultGasLimitFlashMintZeroEx)
    const estimatooor = new GasEstimatooor(publicClient, defaultGasEstimate)
    const gasEstimate = await estimatooor.estimate(undefined)
    expect(gasEstimate).toEqual(defaultGasEstimate)
  })

  it('should throw error if estimation fails and canFail === true (default)', async () => {
    const defaultGasEstimate = BigInt(DefaultGasLimitFlashMintZeroEx)
    const estimatooor = new GasEstimatooor(publicClient, defaultGasEstimate)
    const failingTx = {
      account: '0xundefined' as Address,
      chainId: 1,
      from: signer as Address,
      // to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      gasLimit: BigInt(21_000),
      value: parseUnits('1', 18),
    }
    try {
      await estimatooor.estimate(failingTx)
      throw new Error('should not reach this')
    } catch (error) {
      expect(error).toBeInstanceOf(GasEstimatooorFailedError)
    }
  })

  it('should throw no error and return default if estimation fails and canFail === false', async () => {
    const defaultGasEstimate = BigInt(DefaultGasLimitFlashMintZeroEx)
    const estimatooor = new GasEstimatooor(publicClient, defaultGasEstimate)
    const failingTx = {
      account: '0xundefined' as Address,
      chainId: 1,
      from: signer as Address,
      //   to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      gasLimit: BigInt(21_000),
      value: parseUnits('1', 18),
    }
    const gasEstimate = await estimatooor.estimate(failingTx, false)
    expect(gasEstimate.toString()).toEqual(defaultGasEstimate.toString())
  })

  it('should return gas estimate with margin - on success', async () => {
    const defaultGasEstimate = BigInt(DefaultGasLimitFlashMintZeroEx)
    // const defaultGasMargin = 20
    const estimatooor = new GasEstimatooor(publicClient, defaultGasEstimate)
    const tx = {
      account: signer as Address,
      chainId: 1,
      from: signer as Address,
      to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' as Address,
      gasLimit: BigInt(21_000),
      value: parseUnits('1', 18),
    }
    const gasEstimate = await estimatooor.estimate(tx, false)
    expect(gasEstimate.toString()).toEqual('5000000')
  })
})
