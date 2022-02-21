import React, { createContext, useContext, useEffect, useState } from 'react'

import { ethers } from 'ethers'
import {
  CoinGeckoCoinPrices,
  Position,
  SetDetails,
} from 'set.js/dist/types/src/types'

import { BigNumber } from '@ethersproject/bignumber'
import { useEthers } from '@usedapp/core'

import { MAINNET, POLYGON } from 'constants/chains'
import {
  BedIndex,
  Bitcoin2xFlexibleLeverageIndex,
  DataIndex,
  DefiPulseIndex,
  Ethereum2xFlexibleLeverageIndex,
  Ethereum2xFLIP,
  GmiIndex,
  IEthereumFLIP,
  IMaticFLIP,
  Matic2xFLIP,
  MetaverseIndex,
} from 'constants/tokens'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'
import { preciseDiv, preciseMul } from 'utils'
import { getSetDetails } from 'utils/setjsApi'
import { getTokenList, TokenData as Token } from 'utils/tokenlists'

const ASSET_PLATFORM = 'ethereum'
const VS_CURRENCY = 'usd'

export function useSetComponents() {
  return { ...useContext(SetComponentsContext) }
}

const SetComponentsProvider = (props: { children: any }) => {
  const {
    selectLatestMarketData,
    dpi,
    mvi,
    bed,
    data,
    ethfli,
    ethflip,
    btcfli,
    gmi,
  } = useMarketData()
  const [dpiComponents, setDpiComponents] = useState<SetComponent[]>([])
  const [mviComponents, setMviComponents] = useState<SetComponent[]>([])
  const [bedComponents, setBedComponents] = useState<SetComponent[]>([])
  const [gmiComponents, setGmiComponents] = useState<SetComponent[]>([])
  const [eth2xfliComponents, setEth2xfliComponents] = useState<SetComponent[]>(
    []
  )
  const [eth2xflipComponents, setEth2xflipComponents] = useState<
    SetComponent[]
  >([])
  const [btc2xfliComponents, setBtc2xfliComponents] = useState<SetComponent[]>(
    []
  )
  const [dataComponents, setDataComponents] = useState<SetComponent[]>([])

  const { account, chainId, library } = useEthers()
  const tokenList = getTokenList(chainId)

  useEffect(() => {
    if (
      chainId &&
      chainId === MAINNET.chainId &&
      account &&
      library &&
      tokenList &&
      dpi &&
      mvi &&
      bed &&
      data &&
      gmi &&
      ethfli &&
      ethflip &&
      btcfli &&
      DefiPulseIndex.address &&
      MetaverseIndex.address &&
      BedIndex.address &&
      GmiIndex.address &&
      Ethereum2xFlexibleLeverageIndex.address &&
      Bitcoin2xFlexibleLeverageIndex.address &&
      DataIndex.address
    ) {
      getSetDetails(
        library,
        [
          DefiPulseIndex.address,
          MetaverseIndex.address,
          BedIndex.address,
          GmiIndex.address,
          Ethereum2xFlexibleLeverageIndex.address,
          Bitcoin2xFlexibleLeverageIndex.address,
          DataIndex.address,
        ],
        chainId
      ).then(async (result) => {
        const [
          dpiSet,
          mviSet,
          bedSet,
          gmiSet,
          eth2xfliSet,
          btc2xfliSet,
          dataSet,
        ] = result

        const dpiComponentPrices = await getPositionPrices(dpiSet)
        if (dpiComponentPrices != null) {
          const dpiPositions = dpiSet.positions.map(async (position) => {
            return await convertPositionToSetComponent(
              position,
              tokenList,
              dpiComponentPrices[position.component.toLowerCase()]?.[
                VS_CURRENCY
              ],
              dpiComponentPrices[position.component.toLowerCase()]?.[
                `${VS_CURRENCY}_24h_change`
              ],
              selectLatestMarketData(dpi.hourlyPrices)
            )
          })
          Promise.all(dpiPositions)
            .then(sortPositionsByPercentOfSet)
            .then(setDpiComponents)
        }

        const mviComponentPrices = await getPositionPrices(mviSet)
        if (mviComponentPrices != null) {
          const mviPositions = mviSet.positions.map(async (position) => {
            return await convertPositionToSetComponent(
              position,
              tokenList,
              mviComponentPrices[position.component.toLowerCase()]?.[
                VS_CURRENCY
              ],
              mviComponentPrices[position.component.toLowerCase()]?.[
                `${VS_CURRENCY}_24h_change`
              ],

              selectLatestMarketData(mvi.hourlyPrices)
            )
          })
          Promise.all(mviPositions)
            .then(sortPositionsByPercentOfSet)
            .then(setMviComponents)
        }

        const bedComponentPrices = await getPositionPrices(bedSet)
        if (bedComponentPrices != null) {
          const bedPositions = bedSet.positions.map(async (position) => {
            return await convertPositionToSetComponent(
              position,
              tokenList,
              bedComponentPrices[position.component.toLowerCase()]?.[
                VS_CURRENCY
              ],
              bedComponentPrices[position.component.toLowerCase()]?.[
                `${VS_CURRENCY}_24h_change`
              ],

              selectLatestMarketData(bed.hourlyPrices)
            )
          })
          Promise.all(bedPositions)
            .then(sortPositionsByPercentOfSet)
            .then(setBedComponents)
        }

        const gmiComponentPrices = await getPositionPrices(gmiSet)
        if (gmiComponentPrices != null) {
          const gmiPositions = gmiSet.positions.map(async (position) => {
            return await convertPositionToSetComponent(
              position,
              tokenList,
              gmiComponentPrices[position.component.toLowerCase()]?.[
                VS_CURRENCY
              ],
              gmiComponentPrices[position.component.toLowerCase()]?.[
                `${VS_CURRENCY}_24h_change`
              ],

              selectLatestMarketData(gmi.hourlyPrices)
            )
          })
          Promise.all(gmiPositions)
            .then(sortPositionsByPercentOfSet)
            .then(setGmiComponents)
        }

        const eth2xfliComponentPrices = await getPositionPrices(eth2xfliSet)
        if (eth2xfliComponentPrices != null) {
          const eth2xfliPositions = eth2xfliSet.positions.map(
            async (position) => {
              return await convertPositionToSetComponent(
                position,
                tokenList,
                eth2xfliComponentPrices[position.component.toLowerCase()]?.[
                  VS_CURRENCY
                ],
                eth2xfliComponentPrices[position.component.toLowerCase()]?.[
                  `${VS_CURRENCY}_24h_change`
                ],

                selectLatestMarketData(ethfli.hourlyPrices)
              )
            }
          )
          Promise.all(eth2xfliPositions)
            .then(sortPositionsByPercentOfSet)
            .then(setEth2xfliComponents)
        }

        const btc2xfliComponentPrices = await getPositionPrices(btc2xfliSet)
        if (btc2xfliComponentPrices != null) {
          const btc2xfliPositions = btc2xfliSet.positions.map(
            async (position) => {
              return await convertPositionToSetComponent(
                position,
                tokenList,
                btc2xfliComponentPrices[position.component.toLowerCase()]?.[
                  VS_CURRENCY
                ],
                btc2xfliComponentPrices[position.component.toLowerCase()]?.[
                  `${VS_CURRENCY}_24h_change`
                ],

                selectLatestMarketData(btcfli.hourlyPrices)
              )
            }
          )
          Promise.all(btc2xfliPositions)
            .then(sortPositionsByPercentOfSet)
            .then(setBtc2xfliComponents)
        }

        const dataComponentPrices = await getPositionPrices(dataSet)
        if (dataComponentPrices != null) {
          const dataPositions = dataSet.positions.map(async (position) => {
            return await convertPositionToSetComponent(
              position,
              tokenList,
              dataComponentPrices[position.component.toLowerCase()]?.[
                VS_CURRENCY
              ],
              dataComponentPrices[position.component.toLowerCase()]?.[
                `${VS_CURRENCY}_24h_change`
              ],

              selectLatestMarketData(data.hourlyPrices)
            )
          })
          Promise.all(dataPositions)
            .then(sortPositionsByPercentOfSet)
            .then(setDataComponents)
        }
      })
    }
  }, [
    library,
    tokenList,
    dpi,
    mvi,
    chainId,
    bed,
    gmi,
    ethfli,
    btcfli,
    data,
    selectLatestMarketData(),
  ])

  useEffect(() => {
    if (
      chainId &&
      chainId === POLYGON.chainId &&
      library &&
      tokenList &&
      ethflip &&
      Ethereum2xFLIP.polygonAddress &&
      IEthereumFLIP.polygonAddress &&
      Matic2xFLIP.polygonAddress &&
      IMaticFLIP.polygonAddress
    ) {
      getSetDetails(
        library,
        [
          Ethereum2xFLIP.polygonAddress,
          IEthereumFLIP.polygonAddress,
          Matic2xFLIP.polygonAddress,
          IMaticFLIP.polygonAddress,
        ],
        chainId
      )
        .then(async (result) => {
          const ethflipSet = result[0]
          const ethFlipComponentPrices = await getPositionPrices(
            ethflipSet,
            'polygon-pos'
          )
          const ethFlipPositions = ethflipSet.positions.map(
            async (position) => {
              return await convertPositionToSetComponent(
                position,
                tokenList,
                ethFlipComponentPrices[position.component.toLowerCase()]?.[
                  VS_CURRENCY
                ],
                ethFlipComponentPrices[position.component.toLowerCase()]?.[
                  `${VS_CURRENCY}_24h_change`
                ],

                selectLatestMarketData(ethflip.hourlyPrices)
              )
            }
          )
          Promise.all(ethFlipPositions)
            .then(sortPositionsByPercentOfSet)
            .then(setEth2xflipComponents)
        })
        .catch((err) => console.log('err', err))
    }
  }, [chainId, library, tokenList, ethflip, selectLatestMarketData()])

  return (
    <SetComponentsContext.Provider
      value={{
        dpiComponents: dpiComponents,
        mviComponents: mviComponents,
        bedComponents: bedComponents,
        gmiComponents: gmiComponents,
        eth2xfliComponents: eth2xfliComponents,
        eth2xflipComponents: eth2xflipComponents,
        btc2xfliComponents: btc2xfliComponents,
        dataComponents: dataComponents,
      }}
    >
      {props.children}
    </SetComponentsContext.Provider>
  )
}

async function convertPositionToSetComponent(
  position: Position,
  tokenList: Token[],
  componentPriceUsd: number,
  componentPriceChangeUsd: number,
  setPriceUsd: number
): Promise<SetComponent> {
  const token = getTokenForPosition(tokenList, position)
  if (token === undefined) {
    return {
      address: position.component,
      id: position.component,
      quantity: '',
      symbol: 'SYM',
      name: position.component,
      image: '',
      totalPriceUsd: '0',
      dailyPercentChange: '0',
      percentOfSet: '0',
      percentOfSetNumber: BigNumber.from(0),
    }
  }

  const totalPriceUsd = preciseMul(
    position.unit,
    ethers.utils.parseEther(componentPriceUsd.toString())
  )
  const percentOfSet = preciseMul(
    preciseDiv(totalPriceUsd, ethers.utils.parseEther(setPriceUsd.toString())),
    ethers.utils.parseEther('100')
  )

  return {
    address: position.component,
    id: token.name.toLowerCase(),
    quantity: ethers.utils.formatEther(position.unit),
    symbol: token.symbol,
    name: token.name,
    image: token.logoURI,
    totalPriceUsd: ethers.utils.formatEther(totalPriceUsd.toString()),
    dailyPercentChange: componentPriceChangeUsd
      ? componentPriceChangeUsd.toString()
      : '0',
    percentOfSet: percentOfSet.toString(),
    percentOfSetNumber: percentOfSet,
  }
}

function getTokenForPosition(tokenList: Token[], position: Position): Token {
  const matchingTokens = tokenList.filter(
    (t) => t.address.toLowerCase() === position.component.toLowerCase()
  )
  if (matchingTokens.length === 0) {
    console.warn(
      `No token for position ${position.component} exists in token lists`
    )
  } else if (matchingTokens.length > 1) {
    console.warn(
      `Multiple tokens for position ${position.component} exist in token lists`
    )
  }
  return matchingTokens[0]
}

function sortPositionsByPercentOfSet(
  components: SetComponent[]
): SetComponent[] {
  return components.sort((a, b) => {
    if (b.percentOfSetNumber.gt(a.percentOfSetNumber)) return 1
    if (b.percentOfSetNumber.lt(a.percentOfSetNumber)) return -1
    return 0
  })
}

async function getPositionPrices(
  setDetails: SetDetails,
  assetPlatform: string = ASSET_PLATFORM
): Promise<CoinGeckoCoinPrices> {
  const componentAddresses = setDetails.positions.map((p) => p.component)
  return fetch(
    `https://api.coingecko.com/api/v3/simple/token_price/${assetPlatform}?vs_currencies=${VS_CURRENCY}&contract_addresses=${componentAddresses}&include_24hr_change=true`
  )
    .then((response) => response.json())
    .catch((e) => {
      console.error(e)
      return null
    })
}

export default SetComponentsProvider

interface SetComponentsProps {
  dpiComponents?: SetComponent[]
  mviComponents?: SetComponent[]
  bedComponents?: SetComponent[]
  gmiComponents?: SetComponent[]
  eth2xfliComponents?: SetComponent[]
  eth2xflipComponents?: SetComponent[]
  btc2xfliComponents?: SetComponent[]
  dataComponents?: SetComponent[]
}

export const SetComponentsContext = createContext<SetComponentsProps>({})

export interface SetComponent {
  /**
   * Token address
   * @example "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
   */
  address: string

  /**
   * Token id
   * @example "uniswap"
   */
  id: string

  /**
   * Token image URL
   * @example "https://assets.coingecko.com/coins/images/12504/thumb/uniswap-uni.png"
   */
  image: string

  /**
   * Token name
   * @example "Uniswap"
   */
  name: string

  /**
   * The percent of USD this component makes up in the Set.
   * Equivalant to totalPriceUsd / total price of set in USD
   */
  percentOfSet: string

  /**
   * The percent of USD this component makes up in the Set.
   * Equivalant to totalPriceUsd / total price of set in USD
   */
  percentOfSetNumber: BigNumber

  /**
   * Quantity of component in the Set
   */
  quantity: string

  /**
   * Token symbol
   * @example "UNI"
   */
  symbol: string

  /**
   * Total price of this component. This is equivalant to quantity of
   * component * price of component.
   */
  totalPriceUsd: string

  /**
   * Daily percent price change of this component
   */
  dailyPercentChange: string
}
