import { BigNumber, ethers } from 'ethers'

import { ChainId } from '@usedapp/core'

import { Token } from 'constants/tokens'
import { getRequiredIssuanceComponents } from 'hooks/useExchangeIssuanceZeroEx'
import { displayFromWei } from 'utils'
import { getIssuanceModule } from 'utils/issuanceModule'
import { get0xQuote, ZeroExData } from 'utils/zeroExUtils'

/**
 * Returns exchange issuance quotes (incl. 0x trade data) or null
 *
 * @param buyToken                      The token to buy
 * @param buyTokenAmount                The amount of buy token that should be acquired
 * @param sellToken                     The sell token
 * @param chainId                       ID for current chain
 * @param library                       Web3Provider instance
 *
 * @return tradeData           Array of 0x trade data for the individual positions
 * @return inputTokenAmount    Needed input token amount for trade
 */
export const getExchangeIssuanceQuotes = async (
  buyToken: Token,
  buyTokenAmount: BigNumber,
  sellToken: Token,
  chainId: ChainId = ChainId.Mainnet,
  library: ethers.providers.Web3Provider | undefined
) => {
  const issuanceModule = getIssuanceModule(buyToken.symbol, chainId)
  console.log('Getting issuance quotes')
  console.log(
    'fetching...',
    buyTokenAmount.toString(),
    buyToken.symbol,
    buyToken.address,
    issuanceModule
  )
  const { components, positions } = await getRequiredIssuanceComponents(
    library,
    issuanceModule,
    false,
    buyToken.address!,
    buyTokenAmount
  )

  let positionQuotes: ZeroExData[] = []
  let inputTokenAmount = BigNumber.from(0)
  // TODO:
  const slippagePercents = 3
  // 0xAPI expects percentage as value between 0-1 e.g. 5% -> 0.05
  const slippagePercentage = slippagePercents / 100

  const quotePromises: Promise<any>[] = []
  components.forEach((component, index) => {
    console.log('\n\n###################COMPONENT QUOTE##################')
    const buyAmount = positions[index]
    const buyTokenAddress = component
    const sellTokenAddress =
      sellToken.symbol === 'ETH' ? 'ETH' : sellToken.address
    console.log('buyToken:', buyTokenAddress, 'sellToken:', sellTokenAddress)
    console.log(
      'buyAmount:',
      buyAmount.toString(),
      buyAmount.div(BigNumber.from(10).pow(18)).toString()
    )
    if (buyTokenAddress === sellTokenAddress) {
      console.log('Component equal to input token skipping zero ex api call')
      inputTokenAmount = inputTokenAmount.add(buyAmount)
    } else {
      const quotePromise = get0xQuote(
        {
          buyToken: buyTokenAddress,
          sellToken: sellTokenAddress,
          buyAmount: buyAmount.toString(),
          // excludedSources: '',
          // slippagePercentage,
        },
        chainId ?? 1
      )
      quotePromises.push(quotePromise)
    }
  })

  const results = await Promise.all(quotePromises)
  if (results.length < 1) return null

  positionQuotes = results
  inputTokenAmount = results
    .map((result) => BigNumber.from(result.sellAmount))
    .reduce((prevValue, currValue) => {
      return currValue.add(prevValue)
    })

  console.log('//////////')
  console.log('quotes', positionQuotes)
  console.log(inputTokenAmount.toString())
  console.log(
    displayFromWei(inputTokenAmount, 2, sellToken.decimals),
    sellToken.decimals
  )

  return { tradeData: positionQuotes, inputTokenAmount }
}
