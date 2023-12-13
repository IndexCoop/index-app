import { BigNumber, ethers } from 'ethers'

import { JsonRpcProvider } from '@ethersproject/providers'

import { DefaultGasLimitFlashMintZeroEx } from '@/constants/gas'
import { toWei } from '@/lib/utils'

import { GasEstimatooor, GasEstimatooorFailedError } from './gasEstimatooor'

const provider = new JsonRpcProvider('http://127.0.0.1:8545/')
const signer = new ethers.Wallet(
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  provider
)

describe('GasEstimatooor', () => {
  beforeEach((): void => {
    jest.setTimeout(10000)
  })

  it('should return default estimate for undefined tx', async () => {
    const defaultGasEstimate = BigNumber.from(DefaultGasLimitFlashMintZeroEx)
    const estimatooor = new GasEstimatooor(signer, defaultGasEstimate)
    const gasEstimate = await estimatooor.estimate(undefined)
    expect(gasEstimate).toEqual(defaultGasEstimate)
  })

  it('should throw error if estimation fails and canFail === true (default)', async () => {
    const defaultGasEstimate = BigNumber.from(DefaultGasLimitFlashMintZeroEx)
    const estimatooor = new GasEstimatooor(signer, defaultGasEstimate)
    const failingTx = {
      from: signer.address,
      //   to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      gasLimit: BigNumber.from(21_000),
      value: toWei(1),
    }
    try {
      await estimatooor.estimate(failingTx)
      throw new Error('should not reach this')
    } catch (error) {
      expect(error).toBeInstanceOf(GasEstimatooorFailedError)
    }
  })

  it('should throw no error and return default if estimation fails and canFail === false', async () => {
    const defaultGasEstimate = BigNumber.from(DefaultGasLimitFlashMintZeroEx)
    const estimatooor = new GasEstimatooor(signer, defaultGasEstimate)
    const failingTx = {
      from: signer.address,
      //   to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      gasLimit: BigNumber.from(21_000),
      value: toWei(1),
    }
    const gasEstimate = await estimatooor.estimate(failingTx, false)
    expect(gasEstimate).toEqual(defaultGasEstimate)
  })

  it('should return gas estimate with margin - on success', async () => {
    const defaultGasEstimate = BigNumber.from(DefaultGasLimitFlashMintZeroEx)
    const defaultGasMargin = 20
    const estimatooor = new GasEstimatooor(signer, defaultGasEstimate)
    const tx = {
      from: signer.address,
      to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      gasLimit: BigNumber.from(21_000),
      value: toWei(1),
    }
    const gasEstimate = await estimatooor.estimate(tx, false)
    expect(gasEstimate.toString()).toEqual('23101')
  })
})
