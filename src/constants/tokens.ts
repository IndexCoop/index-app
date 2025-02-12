import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import { mainnet } from 'viem/chains'

import { icethLogo, indexLogo, wseth2Logo } from '@/lib/utils/assets'

export interface Token {
  name: string
  symbol: string
  address: string | undefined
  decimals: number
  image: string
  chainId?: number
}

/**
 * Indices
 */

export const CoinDeskEthTrendIndex: Token = {
  name: 'CoinDesk ETH Trend Index',
  symbol: 'cdETI',
  image:
    'https://uploads-ssl.webflow.com/62e3ff7a08cb1968bf057388/651f04818f458f918171c84d_cdETI-logo.svg',
  address: '0x55b2CFcfe99110C773f00b023560DD9ef6C8A13B',
  decimals: 18,
}

export const DefiPulseIndex: Token = {
  name: 'DeFi Pulse Index',
  symbol: 'DPI',
  image: 'https://index-dao.s3.amazonaws.com/defi_pulse_index_set.svg',
  address: '0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b',
  decimals: 18,
}

const hyeth = getTokenByChainAndSymbol(mainnet.id, 'hyETH')
export const HighYieldETHIndex: Token = {
  ...hyeth,
  image: hyeth.logoURI,
}

export const IndexToken: Token = {
  name: 'Index Token',
  symbol: 'INDEX',
  address: '0x0954906da0Bf32d5479e25f46056d22f08464cab',
  decimals: 18,
  image: indexLogo,
}

export const MetaverseIndex: Token = {
  name: 'Metaverse Index',
  symbol: 'MVI',
  address: '0x72e364F2ABdC788b7E918bc238B21f109Cd634D7',
  decimals: 18,
  image: 'https://set-core.s3.amazonaws.com/img/portfolios/mvi.svg',
}

export const icETHIndex: Token = {
  name: 'Interest Compounding ETH Index',
  symbol: 'icETH',
  address: '0x7C07F7aBe10CE8e33DC6C5aD68FE033085256A84',
  decimals: 18,
  image: icethLogo,
}

const rwa = getTokenByChainAndSymbol(mainnet.id, 'RWA')
export const RealWorldAssetIndex: Token = {
  ...rwa,
  image: rwa.logoURI,
}

/**
 * Other - IndexCoop
 */

export const WSETH2: Token = {
  name: 'wsETH2',
  symbol: 'wsETH2',
  image: wseth2Logo,
  address: '0x5dA21D9e63F1EA13D34e48B7223bcc97e3ecD687',
  decimals: 18,
}

/**
 * Other
 */

export const BTC: Token = {
  name: 'Bitcoin',
  symbol: 'BTC',
  image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
  address: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
  decimals: 18,
}

export const DAI: Token = {
  name: 'Dai',
  symbol: 'DAI',
  image:
    'https://assets.coingecko.com/coins/images/9956/large/4943.png?1636636734',
  address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  decimals: 18,
}

export const ETH: Token = {
  name: 'Ethereum',
  symbol: 'ETH',
  image:
    'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
  address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  decimals: 18,
}

export const GUSD: Token = {
  name: 'Gemini dollar',
  symbol: 'GUSD',
  image:
    'https://assets.coingecko.com/coins/images/5992/large/gemini-dollar-gusd.png',
  address: '0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd',
  decimals: 2,
}

export const MATIC: Token = {
  name: 'Matic',
  symbol: 'MATIC',
  image:
    'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912',
  address: undefined,
  decimals: 18,
}

export const RETH: Token = {
  name: 'rETH',
  symbol: 'rETH',
  image: 'https://assets.coingecko.com/coins/images/20764/large/reth.png',
  address: '0xae78736Cd615f374D3085123A210448E74Fc6393',
  decimals: 18,
}

export const SETH2: Token = {
  name: 'sETH2',
  symbol: 'sETH2',
  image: 'https://assets.coingecko.com/coins/images/16569/large/emerald256.png',
  address: '0xFe2e637202056d30016725477c5da089Ab0A043A',
  decimals: 18,
}

export const STETH: Token = {
  name: 'stETH',
  symbol: 'stETH',
  image: 'https://assets.coingecko.com/coins/images/13442/large/steth_logo.png',
  address: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
  decimals: 18,
}

export const USDC: Token = {
  name: 'USD Coin',
  symbol: 'USDC',
  image:
    'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389',
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  decimals: 6,
}

export const USDT: Token = {
  name: 'Tether',
  symbol: 'USDT',
  image:
    'https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663',
  address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  decimals: 6,
}

export const WETH: Token = {
  name: 'Wrapped Ether',
  symbol: 'WETH',
  image:
    'https://assets.coingecko.com/coins/images/2518/large/weth.png?1628852295',
  address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  decimals: 18,
}

export const WBTC: Token = {
  name: 'Wrapped BTC',
  symbol: 'WBTC',
  image:
    'https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png',
  address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  decimals: 8,
}

export const WSTETH: Token = {
  name: 'wstETH',
  symbol: 'wstETH',
  image: 'https://assets.coingecko.com/coins/images/18834/large/wstETH.png',
  address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
  decimals: 18,
}
