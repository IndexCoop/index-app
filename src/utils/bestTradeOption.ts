import { useEffect, useState } from 'react'

import { ethers } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import { useEthers } from '@usedapp/core'

import { Token } from 'constants/tokens'
import { useExchangeIssuanceZeroEx } from 'hooks/useExchangeIssuanceZeroEx'
import { displayFromWei } from 'utils'
import { getIssuanceModule } from 'utils/issuanceModule'
import { getQuote, getZeroExTradeData, ZeroExData } from 'utils/zeroExUtils'

export const useBestTradeOption = (
  buyToken: Token,
  sellToken: Token,
  sellTokenAmount: string
) => {
  const { getRequiredIssuanceComponents } = useExchangeIssuanceZeroEx()
  const { chainId, library } = useEthers()

  const [bestTradeOption0xData, setBestTradeOption0xData] =
    useState<ZeroExData | null>(null)
  const [isFetching, setIsFetching] = useState<boolean>(false)

  // @param buyTokenAmount make sure this
  const getTradeDataFromExchangeIssuance = async (
    buyTokenAmount: BigNumber
  ) => {
    const issuanceModule = getIssuanceModule(buyToken.symbol, chainId)
    console.log(
      'fetching...',
      buyTokenAmount.toString(),
      buyToken.symbol,
      buyToken.address,
      issuanceModule
    )
    const quotes = await getRequiredIssuanceComponents(
      library,
      issuanceModule,
      false,
      buyToken.address!,
      buyTokenAmount
    )
    const { components, positions } = quotes

    let positionQuotes: string[] = []
    let inputTokenAmount = BigNumber.from(0)
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
      console.log('buyToken:', buyTokenAddress, sellTokenAddress)
      console.log(
        'buyAmount:',
        buyAmount.toString(),
        buyAmount.div(BigNumber.from(10).pow(18)).toString()
      )
      if (buyTokenAddress === sellTokenAddress) {
        console.log('Component equal to input token skipping zero ex api call')
        positionQuotes.push(ethers.utils.formatBytes32String('FOOBAR'))
        inputTokenAmount = inputTokenAmount.add(buyAmount)
      } else {
        const quotePromise = getQuote(
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

    Promise.all(quotePromises).then((results) => {
      if (results.length < 1) return
      positionQuotes = results
      inputTokenAmount = results
        .map((result) => BigNumber.from(result.sellAmount))
        .reduce((prevValue, currValue) => {
          return currValue.add(prevValue)
        })

      console.log('//////////')
      console.log('quotes', positionQuotes)
      console.log(inputTokenAmount.toString())
      console.log(displayFromWei(inputTokenAmount))
    })

    return { tradeData: positionQuotes, inputTokenAmount }
  }

  const fetchAndCompareOptions = async () => {
    setIsFetching(true)
    // Checking all exchanges
    const option1Data = await getZeroExTradeData(
      true,
      sellToken,
      buyToken,
      sellTokenAmount,
      chainId || 1
    )
    // Checking via exchange issuance
    // const buyTokenAmount = option1Data.minOutput
    // const option2Data = await getTradeDataFromExchangeIssuance(buyTokenAmount)
    // TODO: compare and return best option
    setBestTradeOption0xData(option1Data)
    setIsFetching(false)
  }

  useEffect(() => {
    if (buyToken === undefined || sellToken === undefined) return
    if (sellTokenAmount.length < 1 || sellTokenAmount === '0') return
    fetchAndCompareOptions()
  }, [buyToken, sellToken, sellTokenAmount])

  return { bestTradeOption0xData, isFetchingTradeData: isFetching }
}
