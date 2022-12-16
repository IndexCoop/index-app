import { ethers, PopulatedTransaction } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import { ZeroExApi } from '@indexcoop/flash-mint-sdk'

import { ETH, MetaverseIndex } from 'constants/tokens'
import { ExchangeIssuanceZeroExQuote } from 'hooks/useBestQuote'
import { getEnhancedFlashMintZeroExQuote } from 'hooks/useBestQuote/flashMintZeroEx'
import { useTradeFlashMintNotional } from 'hooks/useTradeFlashMintNotional'

import { ERC20Interface } from './abi/interfaces'
import { UNISWAP_ROUTER_ABI } from './abi/UniswapRouterV2'
import { getFlashMintZeroExTransaction } from './flashMint/flashMintZeroExTransaction'
import { getFlashMintNotionalQuote } from './flashMintNotional/fmNotionalQuote'
import { displayFromWei, isValidTokenInput, safeDiv, toWei } from '.'

const MVI = '0x72e364F2ABdC788b7E918bc238B21f109Cd634D7'
const UNISWAP_ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'

const getBalance = async (
  address: string,
  tokenAddress: string | undefined,
  provider: JsonRpcProvider
): Promise<BigNumber | null> => {
  if (!tokenAddress) return null
  const contract = new ethers.Contract(tokenAddress, ERC20Interface, provider)
  const bal = await contract.balanceOf(address)
  return bal
}

async function getSwapTransaction(
  provider: JsonRpcProvider,
  walletAddress: string
): Promise<PopulatedTransaction> {
  const router = new ethers.Contract(
    UNISWAP_ROUTER_ADDRESS,
    UNISWAP_ROUTER_ABI,
    provider
  )

  const amountIn = ethers.utils.parseEther('1')
  const amountOutMin = ethers.utils.parseEther('10')
  var options = { gasLimit: 30000000, value: amountIn } // in wei

  const tx = await router.populateTransaction.swapExactETHForTokens(
    amountOutMin,
    [WETH, MVI],
    walletAddress,
    Date.now() + 1000 * 60 * 10, //10 minutes
    options
  )
  return tx
}

// describe('testtesttest', () => {
//   beforeEach((): void => {
//     jest.setTimeout(1000000)
//   })

//   it('should work', async () => {
//     const provider = new JsonRpcProvider('http://127.0.0.1:8545/')
//     let wallet = new ethers.Wallet(
//       '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
//       provider
//     )
//     console.log(wallet.address)
//     const balance = await wallet.getBalance()
//     console.log(balance.toString())

//     // const mviBalance = await getBalance(wallet.address, MVI, provider)
//     // console.log(mviBalance?.toString(), 'MVI')

//     // const tx = await getSwapTransaction(provider, wallet.address)
//     // const res = await wallet.sendTransaction(tx)
//     // console.log(res)

//     // const mviBalance2 = await getBalance(wallet.address, MVI, provider)
//     // console.log(mviBalance2?.toString(), 'MVI2')

//     const isMinting = true
//     const inputToken = ETH
//     const outputToken = MetaverseIndex
//     const inputTokenBalance = balance
//     const indexTokenAmount = toWei(1)
//     const slippage = 1

//     const inputTokenPrice = 1200
//     const nativeTokenPrice = 1200
//     const gasPrice = BigNumber.from(100)

//     const zeroExApi = new ZeroExApi()

//     const fmZeroExQuote: ExchangeIssuanceZeroExQuote | null =
//       await getEnhancedFlashMintZeroExQuote(
//         isMinting,
//         inputToken.address!,
//         outputToken.address!,
//         inputTokenBalance,
//         inputToken,
//         outputToken,
//         indexTokenAmount,
//         inputTokenPrice,
//         nativeTokenPrice,
//         gasPrice,
//         slippage,
//         1,
//         provider,
//         zeroExApi,
//         wallet
//       )
//     console.log(fmZeroExQuote?.inputOutputTokenAmount.toString())
//     if (!fmZeroExQuote) fail()
//     const txZeroEx = await getFlashMintZeroExTransaction(
//       isMinting,
//       inputToken,
//       outputToken,
//       indexTokenAmount,
//       fmZeroExQuote?.inputOutputTokenAmount,
//       inputTokenBalance,
//       fmZeroExQuote.componentQuotes,
//       provider,
//       wallet,
//       1
//     )
//     console.log(txZeroEx)
//     if (!txZeroEx) {
//       fail()
//     }
//     // const gasEstimate = await wallet.estimateGas(txZeroEx)
//     // console.log(gasEstimate)
//     const res = await wallet.sendTransaction(txZeroEx)
//     console.log(res)

//     // const isMinting = true
//     // const fixedTokenAddress = '0xFB4D3b07aA16eE563Ea7C1f3202959448458e290'
//     // const inputOutputTokenAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
//     // const amountIndexToken = toWei('1')
//     // const slippagePercent = 1
//     // const quote = await getFlashMintNotionalQuote(
//     //   isMinting,
//     //   fixedTokenAddress,
//     //   inputOutputTokenAddress,
//     //   amountIndexToken,
//     //   slippagePercent,
//     //   provider
//     // )
//     // console.log(quote.swapData)
//     // console.log(quote.inputOutputTokenAmount.toString())
//     // expect(quote.indexTokenAmount.toString()).toBe(amountIndexToken.toString())
//     // Execute trade
//     // const { executeFlashMintNotionalTrade } = useTradeFlashMintNotional()
//     // TODO:
//     // await executeFlashMintNotionalTrade(quote, slippagePercent, false)
//   })
// })
