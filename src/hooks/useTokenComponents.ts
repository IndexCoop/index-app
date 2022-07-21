import { useMemo, useState } from 'react'

import { BigNumber, utils } from 'ethers'

import { MAINNET, OPTIMISM, POLYGON } from 'constants/chains'
import { getApiKey, IndexApiBaseUrl } from 'constants/server'
import { Token } from 'constants/tokens'
import { displayFromWei, safeDiv, selectLatestMarketData } from 'utils'
import {
  CoinGeckoCoinPrices,
  getSetDetails,
  Position,
  SetDetails,
} from 'utils/setjsApi'
import { getTokenList, TokenData } from 'utils/tokenlists'
import { getAddressForToken } from 'utils/tokens'

import { useReadOnlyProvider } from './useReadOnlyProvider'

const VS_CURRENCY = 'usd'

export const useTokenComponents = (token: Token, marketData: number[][]) => {
  const chainId = token.chainId || MAINNET.chainId
  const provider = useReadOnlyProvider(chainId)
  const address = getAddressForToken(token, chainId)
  const allTokens = getTokenList(chainId)
  const [components, setComponents] = useState<SetComponent[]>([])
  useMemo(() => {
    getSetDetails(provider, [address!], chainId).then(async (result) => {
      const [setDetails] = result

      const componentData = await getSetComponents(
        setDetails,
        selectLatestMarketData(marketData),
        allTokens,
        chainId
      )
      setComponents(componentData)
    })
  }, [marketData])
  return components
}

const getSetComponents = async (
  set: SetDetails,
  setPriceUsd: number,
  tokenList: TokenData[],
  chainId: number
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
  const key = getApiKey()
  return fetch(
    `${IndexApiBaseUrl}/coingecko/simple/token_price/${assetPlatform}?vs_currencies=${VS_CURRENCY}&contract_addresses=${componentAddresses}&include_24hr_change=true`,
    {
      headers: {
        'X-INDEXCOOP-API-KEY': key,
      },
    }
  )
    .then((response) => response.json())
    .catch((e) => {
      console.error(e)
      return null
    })
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
