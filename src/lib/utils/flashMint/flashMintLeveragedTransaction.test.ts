import {
  collateralDebtSwapData,
  inputSwapData,
  SwapData,
} from '@indexcoop/flash-mint-sdk'

import { ETH, icETHIndex } from '@/constants/tokens'
import { toWei } from '@/lib/utils'
import { LocalhostProvider, SignerAccount0 } from '@/lib/utils/test-utils'

import { getFlashMintLeveragedTransaction } from './flashMintLeveragedTransaction'

const provider = LocalhostProvider
const signer = SignerAccount0

describe('getFlashMintZeroExTransaction()', () => {
  beforeEach((): void => {
    jest.setTimeout(1000000)
  })

  it('should return null if no signer is provided', async () => {
    const isMinting = true
    const inputToken = ETH
    const outputToken = icETHIndex
    const indexTokenAmount = toWei(1)

    const inputOutputTokenAmount = toWei('0.1')
    const swapDataDebtCollateral: SwapData =
      collateralDebtSwapData[icETHIndex.symbol]
    const swapDataPaymentToken: SwapData =
      inputSwapData[icETHIndex.symbol][ETH.symbol]

    const txNoSigner = await getFlashMintLeveragedTransaction(
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      inputOutputTokenAmount,
      swapDataDebtCollateral,
      swapDataPaymentToken,
      provider,
      null,
      1
    )
    expect(txNoSigner).toBeNull()
  })

  it('should return null if no provider is present', async () => {
    const isMinting = true
    const inputToken = ETH
    const outputToken = icETHIndex
    const indexTokenAmount = toWei(1)

    const inputOutputTokenAmount = toWei('0.1')
    const swapDataDebtCollateral: SwapData =
      collateralDebtSwapData[icETHIndex.symbol]
    const swapDataPaymentToken: SwapData =
      inputSwapData[icETHIndex.symbol][ETH.symbol]

    const txNoProvider = await getFlashMintLeveragedTransaction(
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      inputOutputTokenAmount,
      swapDataDebtCollateral,
      swapDataPaymentToken,
      null,
      signer,
      1
    )
    expect(txNoProvider).toBeNull()
  })

  it('should return null if ouput token address is undefined', async () => {
    const isMinting = true
    const inputToken = ETH
    const outputToken = icETHIndex
    const indexTokenAmount = toWei(1)

    const inputOutputTokenAmount = toWei('0.1')
    const swapDataDebtCollateral: SwapData =
      collateralDebtSwapData[icETHIndex.symbol]
    const swapDataPaymentToken: SwapData =
      inputSwapData[icETHIndex.symbol][ETH.symbol]

    const tx = await getFlashMintLeveragedTransaction(
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      inputOutputTokenAmount,
      swapDataDebtCollateral,
      swapDataPaymentToken,
      provider,
      signer,
      10 // Optimism as icETH is not available there
    )
    expect(tx).toBeNull()
  })

  it('should return null if input token address is undefined', async () => {
    const isMinting = false
    const inputToken = icETHIndex
    const outputToken = ETH
    const indexTokenAmount = toWei(1)

    const inputOutputTokenAmount = toWei('0.1')
    const swapDataDebtCollateral: SwapData =
      collateralDebtSwapData[icETHIndex.symbol]
    const swapDataPaymentToken: SwapData =
      inputSwapData[icETHIndex.symbol][ETH.symbol]

    const tx = await getFlashMintLeveragedTransaction(
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      inputOutputTokenAmount,
      swapDataDebtCollateral,
      swapDataPaymentToken,
      provider,
      signer,
      10 // Optimism as icETH is not available there
    )
    expect(tx).toBeNull()
  })

  it('should return a populated tx for minting with ETH', async () => {
    const chainId = 1
    const isMinting = true
    const inputToken = ETH
    const outputToken = icETHIndex
    const indexTokenAmount = toWei(1)

    const inputOutputTokenAmount = toWei('0.1')
    const swapDataDebtCollateral: SwapData =
      collateralDebtSwapData[icETHIndex.symbol]
    const swapDataPaymentToken: SwapData =
      inputSwapData[icETHIndex.symbol][ETH.symbol]

    const tx = await getFlashMintLeveragedTransaction(
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      inputOutputTokenAmount,
      swapDataDebtCollateral,
      swapDataPaymentToken,
      provider,
      signer,
      chainId
    )
    if (!tx) throw new Error('tx is null')
    expect(tx.from).toEqual(signer.address)
    expect(tx.value).toEqual(inputOutputTokenAmount)
  })
})
