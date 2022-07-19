import { createContext, useContext, useEffect, useRef } from 'react'

import { utils } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'

import { MAINNET, OPTIMISM, POLYGON } from 'constants/chains'
import { IndexApiBaseUrl } from 'constants/server'
import {
  BedIndex,
  Bitcoin2xFlexibleLeverageIndex,
  Bitcoin2xFLIP,
  DataIndex,
  DefiPulseIndex,
  Ethereum2xFlexibleLeverageIndex,
  Ethereum2xFLIP,
  GmiIndex,
  IBitcoinFLIP,
  icETHIndex,
  IEthereumFLIP,
  IMaticFLIP,
  JPGIndex,
  Matic2xFLIP,
  MetaverseIndex,
  MNYeIndex,
} from 'constants/tokens'
import { useAllReadOnlyProviders } from 'hooks/useReadOnlyProvider'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'
import { displayFromWei, safeDiv } from 'utils'
import {
  CoinGeckoCoinPrices,
  getSetDetails,
  Position,
  SetDetails,
} from 'utils/setjsApi'
import { getAllTokenLists, TokenData as Token } from 'utils/tokenlists'

const ASSET_PLATFORM = 'ethereum'
const VS_CURRENCY = 'usd'

export function useSetComponents() {
  return { ...useContext(SetComponentsContext) }
}

type CachedSetComponents = Record<string, SetComponent[] | null>

const SetComponentsProvider = (props: { children: any }) => {
  const cache = useRef<CachedSetComponents>({})

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
    iethflip,
    maticflip,
    imaticflip,
    btcflip,
    ibtcflip,
    iceth,
    jpg,
    mnye,
  } = useMarketData()

  const {
    mainnetReadOnlyProvider,
    optimismReadOnlyProvider,
    polygonReadOnlyProvider,
  } = useAllReadOnlyProviders()

  const { mainnetTokens, polygonTokens, optimismTokens } = getAllTokenLists()

  const isCached = (tokenSymbol: string) => {
    return cache.current[tokenSymbol] !== null
  }

  const getComponents = (tokenSymbol: string): SetComponent[] | undefined => {
    return cache.current[tokenSymbol] ?? undefined
  }

  const setCache = (tokenSymbol: string, components: SetComponent[]) => {
    cache.current[tokenSymbol] = components
  }

  useEffect(() => {
    if (
      mainnetReadOnlyProvider &&
      mvi &&
      bed &&
      data &&
      gmi &&
      ethfli &&
      ethflip &&
      btcfli &&
      iceth &&
      jpg
    ) {
      getSetDetails(
        mainnetReadOnlyProvider,
        [
          DefiPulseIndex.address!,
          MetaverseIndex.address!,
          BedIndex.address!,
          GmiIndex.address!,
          Ethereum2xFlexibleLeverageIndex.address!,
          Bitcoin2xFlexibleLeverageIndex.address!,
          DataIndex.address!,
          icETHIndex.address!,
          JPGIndex.address!,
        ],
        MAINNET.chainId
      ).then(async (result) => {
        const [
          dpiSet,
          mviSet,
          bedSet,
          gmiSet,
          eth2xfliSet,
          btc2xfliSet,
          dataSet,
          icethSet,
          jpgSet,
        ] = result

        console.log('isCached fetched', isCached(DefiPulseIndex.symbol))
        if (!isCached(DefiPulseIndex.symbol) && dpi) {
          const dpiComponents = await getSetComponents(
            dpiSet,
            selectLatestMarketData(dpi.hourlyPrices),
            mainnetTokens
          )
          setCache(DefiPulseIndex.symbol, dpiComponents)
          console.log('fetched dpi components')
          // setDpiComponents(dpiComponents)
        }

        if (!isCached(MetaverseIndex.symbol) && mvi) {
          const mviComponents = await getSetComponents(
            mviSet,
            selectLatestMarketData(mvi.hourlyPrices),
            mainnetTokens
          )
          setCache(MetaverseIndex.symbol, mviComponents)
        }

        if (!isCached(BedIndex.symbol) && bed) {
          const bedComponents = await getSetComponents(
            bedSet,
            selectLatestMarketData(bed.hourlyPrices),
            mainnetTokens
          )
          setCache(BedIndex.symbol, bedComponents)
        }

        if (!isCached(GmiIndex.symbol) && gmi) {
          const gmiComponents = await getSetComponents(
            gmiSet,
            selectLatestMarketData(gmi.hourlyPrices),
            mainnetTokens
          )
          setCache(GmiIndex.symbol, gmiComponents)
        }

        if (!isCached(Ethereum2xFlexibleLeverageIndex.symbol) && ethfli) {
          const ethFliComponents = await getSetComponents(
            eth2xfliSet,
            selectLatestMarketData(ethfli.hourlyPrices),
            mainnetTokens
          )
          setCache(Ethereum2xFlexibleLeverageIndex.symbol, ethFliComponents)
        }

        if (!isCached(Bitcoin2xFlexibleLeverageIndex.symbol) && btcfli) {
          const btcFliComponents = await getSetComponents(
            btc2xfliSet,
            selectLatestMarketData(btcfli.hourlyPrices),
            mainnetTokens
          )
          setCache(Bitcoin2xFlexibleLeverageIndex.symbol, btcFliComponents)
        }

        if (!isCached(DataIndex.symbol) && data) {
          const dataComponents = await getSetComponents(
            dataSet,
            selectLatestMarketData(data.hourlyPrices),
            mainnetTokens
          )
          setCache(DataIndex.symbol, dataComponents)
        }

        if (!isCached(icETHIndex.symbol) && iceth) {
          const icEthComponents = await getSetComponents(
            icethSet,
            selectLatestMarketData(iceth.hourlyPrices),
            mainnetTokens
          )
          setCache(icETHIndex.symbol, icEthComponents)
        }

        if (!isCached(JPGIndex.symbol) && jpg) {
          const jpgComponents = await getSetComponents(
            jpgSet,
            selectLatestMarketData(jpg.hourlyPrices),
            mainnetTokens
          )
          setCache(JPGIndex.symbol, jpgComponents)
        }
      })
    }
  }, [
    mainnetReadOnlyProvider,
    dpi,
    mvi,
    bed,
    gmi,
    ethfli,
    btcfli,
    data,
    iceth,
    jpg,
    selectLatestMarketData(),
  ])

  useEffect(() => {
    if (
      polygonReadOnlyProvider &&
      ethflip &&
      iethflip &&
      maticflip &&
      imaticflip &&
      btcflip &&
      ibtcflip &&
      Ethereum2xFLIP.polygonAddress &&
      IEthereumFLIP.polygonAddress &&
      Matic2xFLIP.polygonAddress &&
      IMaticFLIP.polygonAddress &&
      Bitcoin2xFLIP.polygonAddress &&
      IBitcoinFLIP.polygonAddress
    ) {
      getSetDetails(
        polygonReadOnlyProvider,
        [
          Ethereum2xFLIP.polygonAddress,
          IEthereumFLIP.polygonAddress,
          Matic2xFLIP.polygonAddress,
          IMaticFLIP.polygonAddress,
          Bitcoin2xFLIP.polygonAddress,
          IBitcoinFLIP.polygonAddress,
        ],
        POLYGON.chainId
      ).then(async (result) => {
        const [
          ethflipSet,
          iethflipSet,
          maticflipSet,
          imaticflipSet,
          btcflipSet,
          ibtcflipSet,
        ] = result

        if (!isCached(Ethereum2xFLIP.symbol) && ethflip) {
          const ethFlipComponents = await getSetComponents(
            ethflipSet,
            selectLatestMarketData(ethflip.hourlyPrices),
            polygonTokens,
            POLYGON.chainId
          )
          setCache(Ethereum2xFLIP.symbol, ethFlipComponents)
        }

        if (!isCached(IEthereumFLIP.symbol) && iethflip) {
          const iEthFlipComponents = await getSetComponents(
            iethflipSet,
            selectLatestMarketData(iethflip.hourlyPrices),
            polygonTokens,
            POLYGON.chainId
          )
          setCache(IEthereumFLIP.symbol, iEthFlipComponents)
        }

        if (!isCached(Matic2xFLIP.symbol) && iethflip) {
          const matic2xflipComponents = await getSetComponents(
            maticflipSet,
            selectLatestMarketData(iethflip.hourlyPrices),
            polygonTokens,
            POLYGON.chainId
          )
          setCache(Matic2xFLIP.symbol, matic2xflipComponents)
        }

        if (!isCached(IMaticFLIP.symbol) && imaticflip) {
          const imaticFlipComponents = await getSetComponents(
            imaticflipSet,
            selectLatestMarketData(imaticflip.hourlyPrices),
            polygonTokens,
            POLYGON.chainId
          )
          setCache(IMaticFLIP.symbol, imaticFlipComponents)
        }

        if (!isCached(Bitcoin2xFLIP.symbol) && btcflip) {
          const btcFlipComponents = await getSetComponents(
            btcflipSet,
            selectLatestMarketData(btcflip.hourlyPrices),
            polygonTokens,
            POLYGON.chainId
          )
          setCache(Bitcoin2xFLIP.symbol, btcFlipComponents)
        }

        if (!isCached(IBitcoinFLIP.symbol) && ibtcflip) {
          const ibtcFlipComponents = await getSetComponents(
            ibtcflipSet,
            selectLatestMarketData(ibtcflip.hourlyPrices),
            polygonTokens,
            POLYGON.chainId
          )
          setCache(IBitcoinFLIP.symbol, ibtcFlipComponents)
        }
      })
    }
  }, [
    polygonReadOnlyProvider,
    ethflip,
    iethflip,
    maticflip,
    imaticflip,
    btcflip,
    ibtcflip,
    selectLatestMarketData(),
  ])

  useEffect(() => {
    if (optimismReadOnlyProvider && mnye && MNYeIndex.optimismAddress) {
      getSetDetails(
        optimismReadOnlyProvider,
        [MNYeIndex.optimismAddress],
        OPTIMISM.chainId,
        true
      ).then(async (result) => {
        const [mnyeSet] = result

        if (!isCached(MNYeIndex.symbol) && mnye) {
          const mnyeComponents = await getSetComponents(
            mnyeSet,
            selectLatestMarketData(mnye.hourlyPrices),
            optimismTokens,
            OPTIMISM.chainId
          )
          setCache(MNYeIndex.symbol, mnyeComponents)
        }
      })
    }
  }, [optimismReadOnlyProvider, mnye, selectLatestMarketData()])

  return (
    <SetComponentsContext.Provider
      value={{
        dpiComponents: getComponents(DefiPulseIndex.symbol),
        mviComponents: getComponents(MetaverseIndex.symbol),
        bedComponents: getComponents(BedIndex.symbol),
        gmiComponents: getComponents(GmiIndex.symbol),
        eth2xfliComponents: getComponents(
          Ethereum2xFlexibleLeverageIndex.symbol
        ),
        eth2xflipComponents: getComponents(Ethereum2xFLIP.symbol),
        btc2xfliComponents: getComponents(
          Bitcoin2xFlexibleLeverageIndex.symbol
        ),
        dataComponents: getComponents(DataIndex.symbol),
        iethflipComponents: getComponents(IEthereumFLIP.symbol),
        imaticflipComponents: getComponents(IMaticFLIP.symbol),
        matic2xflipComponents: getComponents(Matic2xFLIP.symbol),
        ibtcflipComponents: getComponents(IBitcoinFLIP.symbol),
        btc2xflipComponents: getComponents(Bitcoin2xFLIP.symbol),
        icethComponents: getComponents(icETHIndex.symbol),
        jpgComponents: getComponents(JPGIndex.symbol),
        mnyeComponents: getComponents(MNYeIndex.symbol),
      }}
    >
      {props.children}
    </SetComponentsContext.Provider>
  )
}

const getAssetPlatform = (chainId: number): string => {
  switch (chainId) {
    case OPTIMISM.chainId:
      return 'optimistic-ethereum'
    case POLYGON.chainId:
      return 'polygon-pos'
    default:
      return ASSET_PLATFORM
  }
}

const getSetComponents = async (
  set: SetDetails,
  setPriceUsd: number,
  tokenList: Token[],
  chainId: number = MAINNET.chainId
): Promise<SetComponent[]> => {
  const assetPlatform = getAssetPlatform(chainId)
  const dpiComponentPrices = await getPositionPrices(set, assetPlatform)
  if (dpiComponentPrices === null) return []
  const dpiPositions = set.positions.map(async (position) => {
    return await convertPositionToSetComponent(
      position,
      tokenList,
      dpiComponentPrices[position.component.toLowerCase()]?.[VS_CURRENCY],
      dpiComponentPrices[position.component.toLowerCase()]?.[
        `${VS_CURRENCY}_24h_change`
      ],
      setPriceUsd
    )
  })
  const components = await Promise.all(dpiPositions).then(
    sortPositionsByPercentOfSet
  )
  return components
}

export async function convertPositionToSetComponent(
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
      percentOfSetNumber: 0,
    }
  }

  const commonDecimals = 18
  const decimalsDiff = commonDecimals - token.decimals

  const tokenPriceUsdDecimal = utils.parseUnits(componentPriceUsd.toString())
  const setPriceUsdDecimal = utils.parseUnits(setPriceUsd.toString())

  const tokenValueUsd = utils
    .parseUnits(position.unit.toString(), decimalsDiff)
    .mul(tokenPriceUsdDecimal)

  const percentOfSet = safeDiv(tokenValueUsd, setPriceUsdDecimal)
  const displayPercentOfSet = displayFromWei(
    percentOfSet.mul(BigNumber.from(100)),
    2
  )

  return {
    address: position.component,
    id: token.name.toLowerCase(),
    quantity: utils.formatUnits(
      utils.parseUnits(position.unit.toString(), decimalsDiff)
    ),
    symbol: token.symbol,
    name: token.name,
    image: token.logoURI,
    totalPriceUsd: utils.formatUnits(
      tokenValueUsd,
      commonDecimals + decimalsDiff + token.decimals
    ),
    dailyPercentChange: componentPriceChangeUsd
      ? componentPriceChangeUsd.toString()
      : '0',
    percentOfSet: displayPercentOfSet ?? '0',
    percentOfSetNumber: Number(displayPercentOfSet ?? '0'),
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
    if (b.percentOfSetNumber > a.percentOfSetNumber) return 1
    if (b.percentOfSetNumber < a.percentOfSetNumber) return -1
    return 0
  })
}

async function getPositionPrices(
  setDetails: SetDetails,
  assetPlatform: string = ASSET_PLATFORM
): Promise<CoinGeckoCoinPrices> {
  const componentAddresses = setDetails.positions.map((p) => p.component)
  return fetch(
    `${IndexApiBaseUrl}/coingecko/simple/token_price/${assetPlatform}?vs_currencies=${VS_CURRENCY}&contract_addresses=${componentAddresses}&include_24hr_change=true`
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
  iethflipComponents?: SetComponent[]
  imaticflipComponents?: SetComponent[]
  matic2xflipComponents?: SetComponent[]
  btc2xflipComponents?: SetComponent[]
  ibtcflipComponents?: SetComponent[]
  icethComponents?: SetComponent[]
  jpgComponents?: SetComponent[]
  mnyeComponents?: SetComponent[]
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
  percentOfSetNumber: number

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
