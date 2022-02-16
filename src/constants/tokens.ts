import bedBorderLogo from 'assets/bed-border.png'
import dataLogo from 'assets/data-logo.png'
import gmiLogo from 'assets/gmilogo.png'
import indexLogo from 'assets/index-token.png'
import * as tokenAddresses from 'constants/ethContractAddresses'
import { TokenContextKeys } from 'providers/MarketData/MarketDataProvider'

export const dpiTokenImage =
  'https://index-dao.s3.amazonaws.com/defi_pulse_index_set.svg'

export interface Token {
  name: string
  symbol: string
  address: string | undefined
  polygonAddress: string | undefined
  decimals: number
  image: string
  coingeckoId: string
  tokensetsId: string
  tokenContextKey?: TokenContextKeys
  fees: { streamingFee: string; mintRedeemFee?: string } | undefined
}

export const DAI: Token = {
  name: 'Dai',
  symbol: 'DAI',
  image:
    'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
  address: tokenAddresses.daiTokenAddress,
  polygonAddress: tokenAddresses.daiTokenPolygonAddress,
  decimals: 18,
  coingeckoId: 'dai',
  tokensetsId: 'dpi',
  tokenContextKey: 'dpi',
  fees: undefined,
}

export const USDC: Token = {
  name: 'USD Coin',
  symbol: 'USDC',
  image:
    'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389',
  address: tokenAddresses.usdcTokenAddress,
  polygonAddress: tokenAddresses.usdcTokenPolygonAddress,
  decimals: 6,
  coingeckoId: 'usd-coin',
  tokensetsId: 'usdc',
  fees: undefined,
}

export const ETH: Token = {
  name: 'Ethereum',
  symbol: 'ETH',
  image:
    'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
  address: tokenAddresses.ethTokenAddress,
  polygonAddress: tokenAddresses.wethTokenPolygonAddress,
  decimals: 18,
  coingeckoId: 'ethereum',
  tokensetsId: 'eth',
  fees: undefined,
}

export const MATIC: Token = {
  name: 'Matic',
  symbol: 'MATIC',
  image:
    'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912',
  address: undefined,
  polygonAddress: tokenAddresses.maticTokenPolygonAddress,
  decimals: 18,
  coingeckoId: 'matic-network',
  tokensetsId: 'matic',
  fees: undefined,
}

export const DefiPulseIndex: Token = {
  name: 'DeFi Pulse Index',
  symbol: 'DPI',
  address: tokenAddresses.dpiTokenAddress,
  image: dpiTokenImage,
  polygonAddress: tokenAddresses.dpiTokenPolygonAddress,
  decimals: 18,
  coingeckoId: 'defipulse-index',
  tokensetsId: 'dpi',
  tokenContextKey: 'dpi',
  fees: {
    streamingFee: '0.95%',
  },
}

export const IndexToken: Token = {
  name: 'Index Token',
  symbol: 'INDEX',
  address: tokenAddresses.indexTokenAddress,
  polygonAddress: tokenAddresses.indexTokenPolygonAddress,
  decimals: 18,
  image: indexLogo,
  coingeckoId: 'index-cooperative',
  tokensetsId: 'index',
  fees: undefined,
}

export const Ethereum2xFlexibleLeverageIndex: Token = {
  name: 'Ethereum 2x Flexible Leverage Index',
  symbol: 'ETH2x-FLI',
  address: tokenAddresses.eth2xfliTokenAddress,
  polygonAddress: undefined,
  decimals: 18,
  image: 'https://set-core.s3.amazonaws.com/img/portfolios/eth2x_fli.svg',
  coingeckoId: 'eth-2x-flexible-leverage-index',
  tokensetsId: 'ethfli',
  tokenContextKey: 'ethfli',
  fees: {
    streamingFee: '1.95%',
  },
}

export const Ethereum2xFLIP: Token = {
  name: 'Ethereum 2x FLI Polygon',
  symbol: 'ETH2X-FLI-P',
  address: undefined,
  polygonAddress: tokenAddresses.eth2xflipTokenAddress,
  decimals: 18,
  image: 'https://set-core.s3.amazonaws.com/img/portfolios/eth2x_fli.svg',
  coingeckoId: 'index-coop-eth-2x-flexible-leverage-index',
  tokensetsId: 'eth2x-fli-p',
  tokenContextKey: 'ethflip',
  fees: {
    streamingFee: '1.95%',
    mintRedeemFee: '0.1%',
  },
}

export const MetaverseIndex: Token = {
  name: 'Metaverse Index',
  symbol: 'MVI',
  address: tokenAddresses.mviTokenAddress,
  polygonAddress: tokenAddresses.mviTokenPolygonAddress,
  decimals: 18,
  image: 'https://set-core.s3.amazonaws.com/img/portfolios/mvi.svg',
  coingeckoId: 'metaverse-index',
  tokensetsId: 'mvi',
  tokenContextKey: 'mvi',
  fees: {
    streamingFee: '0.95%',
  },
}

export const Bitcoin2xFlexibleLeverageIndex: Token = {
  name: 'Bitcoin 2x Flexible Leverage Index',
  symbol: 'BTC2x-FLI',
  address: tokenAddresses.btc2xfliTokenAddress,
  polygonAddress: undefined,
  decimals: 18,
  image: 'https://set-core.s3.amazonaws.com/img/portfolios/fli_btc.svg',
  coingeckoId: 'btc-2x-flexible-leverage-index',
  tokensetsId: 'btcfli',
  tokenContextKey: 'btcfli',
  fees: {
    streamingFee: '1.95%',
  },
}

export const BedIndex: Token = {
  name: 'Bankless BED Index',
  symbol: 'BED',
  address: tokenAddresses.bedTokenAddress,
  polygonAddress: undefined,
  decimals: 18,
  image: bedBorderLogo,
  coingeckoId: 'bankless-bed-index',
  tokensetsId: 'bed',
  tokenContextKey: 'bed',
  fees: {
    streamingFee: '0.25%',
  },
}

export const DataIndex: Token = {
  name: 'Data Economy Index',
  symbol: 'DATA',
  address: tokenAddresses.dataTokenAddress,
  polygonAddress: tokenAddresses.dataTokenPolygonAddress,
  decimals: 18,
  image: dataLogo,
  coingeckoId: 'data-economy-index',
  tokensetsId: 'data',
  tokenContextKey: 'data',
  fees: {
    streamingFee: '0.95%',
  },
}

export const GmiIndex: Token = {
  name: 'Bankless DeFi Innovation Index',
  symbol: 'GMI',
  address: tokenAddresses.gmiTokenAddress,
  polygonAddress: tokenAddresses.gmiTokenPolygonAddress,
  decimals: 18,
  image: gmiLogo,
  coingeckoId: 'bankless-defi-innovation-index',
  tokensetsId: 'gmi',
  tokenContextKey: 'gmi',
  fees: {
    streamingFee: '1.95%',
  },
}

export const productTokensBySymbol = {
  'DPI': DefiPulseIndex,
  'MVI': MetaverseIndex,
  'ETH2x-FLI': Ethereum2xFlexibleLeverageIndex,
  'ETH2x-FLI-P': Ethereum2xFLIP,
  'INDEX': IndexToken,
  'BTC2x-FLI': Bitcoin2xFlexibleLeverageIndex,
  'BED': BedIndex,
  'DATA': DataIndex,
  'GMI': GmiIndex,
}

export const currencyTokensBySymbol = {
  ETH: ETH,
  MATIC: MATIC,
  DAI: DAI,
  USDC: USDC,
}

const indexNames = [
  DefiPulseIndex,
  MetaverseIndex,
  Ethereum2xFlexibleLeverageIndex,
  Ethereum2xFLIP,
  IndexToken,
  Bitcoin2xFlexibleLeverageIndex,
  BedIndex,
  DataIndex,
  GmiIndex,
]

export default indexNames
