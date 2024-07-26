import { BigNumber, ethers } from 'ethers'
import { createPublicClient, http, parseUnits } from 'viem'

import { DefaultGasLimitFlashMintZeroEx } from '@/constants/gas'

import { GasEstimatooor, GasEstimatooorFailedError } from './gas-estimatooor'

const signer = new ethers.Wallet(
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
)

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
      account: '0xundefined',
      from: signer.address,
      //   to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      gasLimit: BigNumber.from(21_000),
      value: BigNumber.from(parseUnits('1', 18).toString()),
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
      account: '0xundefined',
      from: signer.address,
      //   to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      gasLimit: BigNumber.from(21_000),
      value: BigNumber.from(parseUnits('1', 18).toString()),
    }
    const gasEstimate = await estimatooor.estimate(failingTx, false)
    expect(gasEstimate.toString()).toEqual(defaultGasEstimate.toString())
  })

  it('should return gas estimate with margin - on success', async () => {
    const defaultGasEstimate = BigInt(DefaultGasLimitFlashMintZeroEx)
    // const defaultGasMargin = 20
    const estimatooor = new GasEstimatooor(publicClient, defaultGasEstimate)
    const tx = {
      account: signer.address,
      from: signer.address,
      to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      gasLimit: BigNumber.from(21_000),
      value: BigNumber.from(parseUnits('1', 18).toString()),
    }
    const gasEstimate = await estimatooor.estimate(tx, false)
    expect(gasEstimate.toString()).toEqual('23101')
  })
})
