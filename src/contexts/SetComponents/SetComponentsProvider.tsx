import React, { createContext, useContext, useEffect, useState } from 'react'

import {
  CoinGeckoCoinPrices,
  Position,
  SetDetails,
} from 'set.js/dist/types/src/types'

import { BigNumber } from '@ethersproject/bignumber'
import { useEthers } from '@usedapp/core'

import {
  bedTokenAddress,
  btc2xfliTokenAddress,
  dataTokenAddress,
  dpiTokenAddress,
  dpiTokenPolygonAddress,
  eth2xflipTokenAddress,
  eth2xfliTokenAddress,
  gmiTokenAddress,
  mviTokenAddress,
  mviTokenPolygonAddress,
} from 'constants/ethContractAddresses'
import { useMarketData } from 'contexts/MarketData/MarketDataProvider'
import { fromWei, preciseDiv, preciseMul, toWei } from 'utils'
import { MAINNET_CHAIN_DATA, POLYGON_CHAIN_DATA } from 'utils/connectors'
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
      chainId === MAINNET_CHAIN_DATA.chainId &&
      account &&
      library &&
      dpiTokenAddress &&
      mviTokenAddress &&
      bedTokenAddress &&
      gmiTokenAddress &&
      eth2xfliTokenAddress &&
      btc2xfliTokenAddress &&
      dataTokenAddress &&
      tokenList &&
      dpi &&
      mvi &&
      bed &&
      data &&
      gmi &&
      ethfli &&
      ethflip &&
      btcfli
    ) {
      getSetDetails(
        library,
        [
          dpiTokenAddress,
          mviTokenAddress,
          bedTokenAddress,
          gmiTokenAddress,
          eth2xfliTokenAddress,
          btc2xfliTokenAddress,
          dataTokenAddress,
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
        const dpiPositions = dpiSet.positions.map(async (position) => {
          return await convertPositionToSetComponent(
            position,
            tokenList,
            dpiComponentPrices[position.component.toLowerCase()]?.[VS_CURRENCY],
            dpiComponentPrices[position.component.toLowerCase()]?.[
              `${VS_CURRENCY}_24h_change`
            ],
            selectLatestMarketData(dpi.hourlyPrices)
          )
        })
        Promise.all(dpiPositions)
          .then(sortPositionsByPercentOfSet)
          .then(setDpiComponents)

        const mviComponentPrices = await getPositionPrices(mviSet)
        const mviPositions = mviSet.positions.map(async (position) => {
          return await convertPositionToSetComponent(
            position,
            tokenList,
            mviComponentPrices[position.component.toLowerCase()]?.[VS_CURRENCY],
            mviComponentPrices[position.component.toLowerCase()]?.[
              `${VS_CURRENCY}_24h_change`
            ],

            selectLatestMarketData(mvi.hourlyPrices)
          )
        })
        Promise.all(mviPositions)
          .then(sortPositionsByPercentOfSet)
          .then(setMviComponents)

        const bedComponentPrices = await getPositionPrices(bedSet)
        const bedPositions = bedSet.positions.map(async (position) => {
          return await convertPositionToSetComponent(
            position,
            tokenList,
            bedComponentPrices[position.component.toLowerCase()]?.[VS_CURRENCY],
            bedComponentPrices[position.component.toLowerCase()]?.[
              `${VS_CURRENCY}_24h_change`
            ],

            selectLatestMarketData(bed.hourlyPrices)
          )
        })
        Promise.all(bedPositions)
          .then(sortPositionsByPercentOfSet)
          .then(setBedComponents)

        const gmiComponentPrices = await getPositionPrices(gmiSet)
        const gmiPositions = gmiSet.positions.map(async (position) => {
          return await convertPositionToSetComponent(
            position,
            tokenList,
            gmiComponentPrices[position.component.toLowerCase()]?.[VS_CURRENCY],
            gmiComponentPrices[position.component.toLowerCase()]?.[
              `${VS_CURRENCY}_24h_change`
            ],

            selectLatestMarketData(gmi.hourlyPrices)
          )
        })
        Promise.all(gmiPositions)
          .then(sortPositionsByPercentOfSet)
          .then(setGmiComponents)

        const eth2xfliComponentPrices = await getPositionPrices(eth2xfliSet)
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

        const btc2xfliComponentPrices = await getPositionPrices(btc2xfliSet)
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

        const dataComponentPrices = await getPositionPrices(dataSet)
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
      chainId === POLYGON_CHAIN_DATA.chainId &&
      library &&
      dpiTokenPolygonAddress &&
      mviTokenPolygonAddress &&
      eth2xflipTokenAddress &&
      tokenList &&
      ethflip
    ) {
      getSetDetails(library, [eth2xflipTokenAddress], chainId)
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

  const valuePerToken = preciseMul(position.unit, toWei(componentPriceUsd)) // per 1e18  ---- valuePerToken 350172275 62840000000000000000 22004825761
  const percentOfSet2 = preciseDiv(valuePerToken, toWei(setPriceUsd)) // valuePerToken / set price ----- percentOfSet2 22004825761 8 102801534272785670000

  console.log(
    'valuePerToken',
    position.unit.toString(),
    toWei(componentPriceUsd).toString(),
    valuePerToken.toString()
  )
  console.log(
    'percentOfSet2',
    valuePerToken.toString(),
    token.decimals,
    toWei(setPriceUsd).toString()
  )

  const quantity = position.unit.div(BigNumber.from(10).pow(token.decimals))
  const totalPriceUsd = quantity.mul(
    BigNumber.from(componentPriceUsd).mul(BigNumber.from(10).pow(18))
  )
  const percentOfSet = totalPriceUsd
    .div(BigNumber.from(setPriceUsd).mul(BigNumber.from(10).pow(18)))
    .mul(100)

  return {
    address: position.component,
    id: token.name.toLowerCase(),
    quantity: quantity.toString(),
    symbol: token.symbol,
    name: token.name,
    image: token.logoURI,
    totalPriceUsd: totalPriceUsd.toString(),
    dailyPercentChange: componentPriceChangeUsd.toString(),
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
    .catch((e) => console.error(e))
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
