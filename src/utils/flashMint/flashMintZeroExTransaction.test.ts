import { ethers } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'

import { ETH, MetaverseIndex } from 'constants/tokens'
import { displayFromWei, isValidTokenInput, safeDiv, toWei } from 'utils'

import { getFlashMintZeroExTransaction } from './flashMintZeroExTransaction'

const provider = new JsonRpcProvider('http://127.0.0.1:8545/')
const wallet = new ethers.Wallet(
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  provider
)

describe('getFlashMintZeroExTransaction()', () => {
  beforeEach((): void => {
    jest.setTimeout(1000000)
  })

  it('should return null if no signer is provided', async () => {
    const isMinting = true
    const inputToken = ETH
    const outputToken = MetaverseIndex
    const indexTokenAmount = toWei(1)
    const inputTokenBalance = toWei(0)

    const inputOutputTokenAmount = toWei('0.1')
    const componentQuotes: string[] = []

    const txNoSigner = await getFlashMintZeroExTransaction(
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      inputOutputTokenAmount,
      inputTokenBalance,
      componentQuotes,
      provider,
      null,
      1
    )
    expect(txNoSigner).toBeNull()
  })

  it('should return null if no provider is present', async () => {
    const isMinting = true
    const inputToken = ETH
    const outputToken = MetaverseIndex
    const indexTokenAmount = toWei(1)
    const inputTokenBalance = toWei(0)

    const inputOutputTokenAmount = toWei('0.1')
    const componentQuotes: string[] = []

    const txNoProvider = await getFlashMintZeroExTransaction(
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      inputOutputTokenAmount,
      inputTokenBalance,
      componentQuotes,
      null,
      wallet,
      1
    )
    expect(txNoProvider).toBeNull()
  })

  it('should return null if isMinting and insufficient funds', async () => {
    const isMinting = true
    const inputToken = ETH
    const outputToken = MetaverseIndex
    const indexTokenAmount = toWei(1)
    const inputTokenBalance = toWei(0)

    const inputOutputTokenAmount = toWei('0.1')
    const componentQuotes: string[] = []

    const tx = await getFlashMintZeroExTransaction(
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      inputOutputTokenAmount,
      inputTokenBalance,
      componentQuotes,
      provider,
      wallet,
      1
    )
    expect(tx).toBeNull()
  })

  it('should return null if !isMinting and insufficient funds', async () => {
    const isMinting = false
    const inputToken = MetaverseIndex
    const outputToken = ETH
    const indexTokenAmount = toWei(1)
    const inputTokenBalance = toWei(0)

    const inputOutputTokenAmount = toWei('0.1')
    const componentQuotes: string[] = []

    const tx = await getFlashMintZeroExTransaction(
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      inputOutputTokenAmount,
      inputTokenBalance,
      componentQuotes,
      provider,
      wallet,
      1
    )
    expect(tx).toBeNull()
  })

  it('should return null if ouput token address is undefined', async () => {
    const isMinting = true
    const inputToken = ETH
    const outputToken = MetaverseIndex
    const indexTokenAmount = toWei(1)
    const inputTokenBalance = toWei(1)

    const inputOutputTokenAmount = toWei('0.1')
    const componentQuotes: string[] = []

    const tx = await getFlashMintZeroExTransaction(
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      inputOutputTokenAmount,
      inputTokenBalance,
      componentQuotes,
      provider,
      wallet,
      10 // Optimism as MVI is not available there
    )
    expect(tx).toBeNull()
  })

  it('should return null if input token address is undefined', async () => {
    const isMinting = false
    const inputToken = MetaverseIndex
    const outputToken = ETH
    const indexTokenAmount = toWei(1)
    const inputTokenBalance = toWei(1)

    const inputOutputTokenAmount = toWei('0.1')
    const componentQuotes: string[] = []

    const tx = await getFlashMintZeroExTransaction(
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      inputOutputTokenAmount,
      inputTokenBalance,
      componentQuotes,
      provider,
      wallet,
      10 // Optimism as MVI is not available there
    )
    expect(tx).toBeNull()
  })

  it('should return a populated tx for minting with ETH', async () => {
    const chainId = 1
    const isMinting = true
    const inputToken = ETH
    const outputToken = MetaverseIndex
    const indexTokenAmount = toWei(1)
    const inputTokenBalance = toWei(1)

    const inputOutputTokenAmount = toWei('0.1')
    const componentQuotes: string[] = []

    const tx = await getFlashMintZeroExTransaction(
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      inputOutputTokenAmount,
      inputTokenBalance,
      componentQuotes,
      provider,
      wallet,
      chainId
    )
    if (!tx) fail()
    expect(tx.from).toEqual(wallet.address)
    expect(tx.value).toEqual(inputOutputTokenAmount)
  })
})
