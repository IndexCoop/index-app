import { ETH, MetaverseIndex } from 'constants/tokens'
import { toWei } from 'utils'
import { LocalhostProvider, SignerAccount0 } from 'utils/test-utils'

import { getFlashMintZeroExTransaction } from './flashMintZeroExTransaction'

const provider = LocalhostProvider
const wallet = SignerAccount0

describe('getFlashMintZeroExTransaction()', () => {
  beforeEach((): void => {
    jest.setTimeout(1000000)
  })

  it('should return null if no signer is provided', async () => {
    const isMinting = true
    const inputToken = ETH
    const outputToken = MetaverseIndex
    const indexTokenAmount = toWei(1)

    const inputOutputTokenAmount = toWei('0.1')
    const componentQuotes: string[] = []

    const txNoSigner = await getFlashMintZeroExTransaction(
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      inputOutputTokenAmount,
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

    const inputOutputTokenAmount = toWei('0.1')
    const componentQuotes: string[] = []

    const txNoProvider = await getFlashMintZeroExTransaction(
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      inputOutputTokenAmount,
      componentQuotes,
      null,
      wallet,
      1
    )
    expect(txNoProvider).toBeNull()
  })

  it('should return null if ouput token address is undefined', async () => {
    const isMinting = true
    const inputToken = ETH
    const outputToken = MetaverseIndex
    const indexTokenAmount = toWei(1)

    const inputOutputTokenAmount = toWei('0.1')
    const componentQuotes: string[] = []

    const tx = await getFlashMintZeroExTransaction(
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      inputOutputTokenAmount,
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

    const inputOutputTokenAmount = toWei('0.1')
    const componentQuotes: string[] = []

    const tx = await getFlashMintZeroExTransaction(
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      inputOutputTokenAmount,
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

    const inputOutputTokenAmount = toWei('0.1')
    const componentQuotes: string[] = []

    const tx = await getFlashMintZeroExTransaction(
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      inputOutputTokenAmount,
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
