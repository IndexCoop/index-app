import { SwapData } from '@indexcoop/flash-mint-sdk'

import { DAI, FIXED_DAI } from 'constants/tokens'
import { toWei } from 'utils'
import { LocalhostProvider, SignerAccount0 } from 'utils/test-utils'

import { getFlashMintNotionalContract } from './fmNotionalContract'
import { getFlashMintNotionalTransaction } from './fmNotionalTransaction'

const provider = LocalhostProvider
const signer = SignerAccount0

describe('getFlashMintNotionalTransaction()', () => {
  beforeEach((): void => {
    jest.setTimeout(1000000)
  })

  it('should return null if no signer is provided', async () => {
    const isMinting = true
    const inputToken = DAI
    const outputToken = FIXED_DAI
    const indexTokenAmount = toWei(1)
    const slippage = 0

    const inputOutputTokenAmount = toWei('0.1')
    const swapData: SwapData[] = []

    const txNoSigner = await getFlashMintNotionalTransaction(
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      inputOutputTokenAmount,
      swapData,
      slippage,
      provider,
      null,
      1
    )
    expect(txNoSigner).toBeNull()
  })

  it('should return null if no provider is present', async () => {
    const isMinting = true
    const inputToken = DAI
    const outputToken = FIXED_DAI
    const indexTokenAmount = toWei(1)
    const slippage = 0

    const inputOutputTokenAmount = toWei('0.1')
    const swapData: SwapData[] = []

    const txNoProvider = await getFlashMintNotionalTransaction(
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      inputOutputTokenAmount,
      swapData,
      slippage,
      provider,
      null,
      1
    )
    expect(txNoProvider).toBeNull()
  })

  it('should return null if ouput token address is undefined', async () => {
    const isMinting = true
    const inputToken = DAI
    const outputToken = FIXED_DAI
    const indexTokenAmount = toWei(1)
    const slippage = 0

    const inputOutputTokenAmount = toWei('0.1')
    const swapData: SwapData[] = []

    const tx = await getFlashMintNotionalTransaction(
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      inputOutputTokenAmount,
      swapData,
      slippage,
      provider,
      signer,
      10 // Optimism as MVI is not available there
    )
    expect(tx).toBeNull()
  })

  it('should return null if ouput token address is undefined', async () => {
    const isMinting = false
    const inputToken = FIXED_DAI
    const outputToken = DAI
    const indexTokenAmount = toWei(1)
    const slippage = 0

    const inputOutputTokenAmount = toWei('0.1')
    const swapData: SwapData[] = []

    const tx = await getFlashMintNotionalTransaction(
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      inputOutputTokenAmount,
      swapData,
      slippage,
      provider,
      signer,
      10 // Optimism as MVI is not available there
    )
    expect(tx).toBeNull()
  })

  it('should return a populated tx for minting with DAI', async () => {
    const chainId = 1
    const isMinting = true
    const inputToken = DAI
    const outputToken = FIXED_DAI
    const indexTokenAmount = toWei(1)
    const slippage = 0

    const inputOutputTokenAmount = toWei('0.1')
    const swapData: SwapData[] = []

    const tx = await getFlashMintNotionalTransaction(
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      inputOutputTokenAmount,
      swapData,
      slippage,
      provider,
      signer,
      chainId
    )
    if (!tx) fail()
    const fmNotionalContract = getFlashMintNotionalContract(signer)
    expect(tx.to).toEqual(fmNotionalContract.address)
    expect(tx.from).toEqual(signer.address)
  })

  it('should return a populated tx for redeeming FIXED_DAI', async () => {
    const chainId = 1
    const isMinting = false
    const inputToken = FIXED_DAI
    const outputToken = DAI
    const indexTokenAmount = toWei(1)
    const slippage = 0

    const inputOutputTokenAmount = toWei('0.1')
    const swapData: SwapData[] = []

    const tx = await getFlashMintNotionalTransaction(
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      inputOutputTokenAmount,
      swapData,
      slippage,
      provider,
      signer,
      chainId
    )
    if (!tx) fail()
    const fmNotionalContract = getFlashMintNotionalContract(signer)
    expect(tx.to).toEqual(fmNotionalContract.address)
    expect(tx.from).toEqual(signer.address)
  })
})
