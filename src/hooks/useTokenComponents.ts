import { useMemo, useState } from 'react'

import { BigNumber, utils } from 'ethers'

import { MAINNET, OPTIMISM, POLYGON } from 'constants/chains'
import { IndexToken, Token } from 'constants/tokens'
import { displayFromWei, fromWei, safeDiv, selectLatestMarketData } from 'utils'
import { IndexApi } from 'utils/indexApi'
import {
  CoinGeckoCoinPrices,
  getSetDetails,
  getSetPerps,
  Position,
  SetDetails,
} from 'utils/setjsApi'
import { getTokenList, TokenData } from 'utils/tokenlists'
import { getAddressForToken } from 'utils/tokens'

import { useReadOnlyProvider } from './useReadOnlyProvider'

const VS_CURRENCY = 'usd'

export const useTokenComponents = (
  token: Token,
  marketData: number[][],
  isPerpToken = false
) => {
  const chainId = token.defaultChain || MAINNET.chainId
  const provider = useReadOnlyProvider(chainId)
  const [components, setComponents] = useState<SetComponent[]>([])
  const [vAssets, setVAssets] = useState<SetComponent[]>([])
  const [nav, setNav] = useState<number>(0)
  const address = getAddressForToken(token, chainId)

  useMemo(() => {
    if (!address || token.symbol === IndexToken.symbol) {
      setComponents([])
      return
    }
    const allTokens = getTokenList(chainId)
    getSetDetails(provider, [address], chainId).then(async (result) => {
      const [setDetails] = result
      const componentData = await getSetComponents(
        setDetails,
        selectLatestMarketData(marketData),
        allTokens,
        chainId
      )
      setComponents(componentData)
    })
    if (isPerpToken) {
      getSetPerps(provider, address).then(async (result) => {
        const tokenList = getTokenList(chainId)
        const vTokens: SetComponent[] = result.map((perp) => {
          const token = tokenList.find((t) => t.address === perp.vAssetAddress)
          const vAsset: SetComponent = {
            id: token?.name || perp.symbol,
            name: token?.name || perp.symbol,
            symbol: perp.symbol,
            address: perp.vAssetAddress,
            quantity: perp.positionUnit.toString(),
            image: token?.logoURI || '',
            totalPriceUsd: fromWei(
              perp.indexPrice.mul(perp.positionUnit),
              36
            ).toString(),
            dailyPercentChange: '0',
            percentOfSet: '0',
            percentOfSetNumber: 0,
          }
          return vAsset
        })
        setVAssets(vTokens)
      })
    }
  }, [marketData])
  useMemo(() => {
    if (components.length === 0 && vAssets.length === 0) return
    setNav(getNetAssetValue(components.concat(vAssets)))
  }, [components, vAssets])
  return { components, vAssets, nav }
}

const getSetComponents = async (
  set: SetDetails,
  setPriceUsd: number,
  tokenList: TokenData[],
  chainId: number
): Promise<SetComponent[]> => {
  const assetPlatform = getAssetPlatform(chainId)
  const componentPrices = await getPositionPrices(set, assetPlatform)
  if (componentPrices === null) return []
  const positions = set.positions.map(async (position) => {
    return await convertPositionToSetComponent(
      position,
      tokenList,
      componentPrices[position.component.toLowerCase()]?.[VS_CURRENCY],
      componentPrices[position.component.toLowerCase()]?.[
        `${VS_CURRENCY}_24h_change`
      ],
      setPriceUsd
    )
  })
  const components = await Promise.all(positions).then(
    sortPositionsByPercentOfSet
  )
  return components
}

const getAssetPlatform = (chainId: number): string => {
  switch (chainId) {
    case OPTIMISM.chainId:
      return 'optimistic-ethereum'
    case POLYGON.chainId:
      return 'polygon-pos'
    default:
      return 'ethereum'
  }
}

async function getPositionPrices(
  setDetails: SetDetails,
  assetPlatform: string
): Promise<CoinGeckoCoinPrices> {
  const componentAddresses = setDetails.positions.map((p) => p.component)
  const indexApi = new IndexApi()
  const path = `/coingecko/simple/token_price/${assetPlatform}?vs_currencies=${VS_CURRENCY}&contract_addresses=${componentAddresses}&include_24hr_change=true`
  const prices = await indexApi.get(path)
  return prices
}

export async function convertPositionToSetComponent(
  position: Position,
  tokenList: TokenData[],
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

function getTokenForPosition(
  tokenList: TokenData[],
  position: Position
): TokenData {
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

const getNetAssetValue = (components: SetComponent[]): number => {
  let totalValue: number = 0
  if (components.length > 0)
    components.forEach((c) => {
      totalValue += parseFloat(c.totalPriceUsd)
    })
  return totalValue
}

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
