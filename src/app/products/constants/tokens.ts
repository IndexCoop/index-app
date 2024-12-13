import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import { base, mainnet } from 'viem/chains'

import { ProductRow } from '@/app/products/types/product'
import {
  buildEarnTradePath,
  buildLeverageTradePath,
  buildSwapTradePath,
} from '@/app/products/utils/trade-path'
import { BASE } from '@/constants/chains'

export const productTokens: ProductRow[] = [
  {
    ...getTokenByChainAndSymbol(mainnet.id, 'ETH2X'),
    hasApy: false,
    listType: 'Strategies',
    tradeHref: buildLeverageTradePath('eth2x'),
  },
  {
    ...getTokenByChainAndSymbol(mainnet.id, 'DPI'),
    hasApy: false,
    listType: 'Strategies',
    tradeHref: buildSwapTradePath('dpi'),
  },
  {
    ...getTokenByChainAndSymbol(mainnet.id, 'hyETH'),
    hasApy: true,
    listType: 'Earn',
    tradeHref: buildEarnTradePath('hyETH'),
  },
  {
    ...getTokenByChainAndSymbol(mainnet.id, 'icETH'),
    hasApy: true,
    listType: 'Earn',
    tradeHref: buildEarnTradePath('icETH'),
  },
  {
    ...getTokenByChainAndSymbol(mainnet.id, 'MVI'),
    hasApy: false,
    listType: 'Strategies',
    tradeHref: buildSwapTradePath('mvi'),
  },
  {
    ...getTokenByChainAndSymbol(mainnet.id, 'BTC2X'),
    hasApy: false,
    listType: 'Strategies',
    tradeHref: buildLeverageTradePath('btc2x'),
  },
  {
    ...getTokenByChainAndSymbol(mainnet.id, 'dsETH'),
    hasApy: true,
    listType: 'Earn',
    tradeHref: buildEarnTradePath('dsETH'),
  },
  {
    ...getTokenByChainAndSymbol(mainnet.id, 'BED'),
    hasApy: false,
    listType: 'Strategies',
    tradeHref: buildSwapTradePath('bed'),
  },
  {
    ...getTokenByChainAndSymbol(base.id, 'icUSD'),
    hasApy: true,
    listType: 'Earn',
    tradeHref: buildEarnTradePath('icUSD', 'USDC', BASE.chainId),
  },
  {
    ...getTokenByChainAndSymbol(mainnet.id, 'cdETI'),
    hasApy: false,
    listType: 'Strategies',
    tradeHref: buildSwapTradePath('cdeti'),
  },
]
