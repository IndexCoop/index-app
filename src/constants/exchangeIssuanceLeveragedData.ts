import { Exchange } from 'utils/exchangeIssuanceQuotes'

import { ETH, MATIC } from './tokens'

const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export const collateralDebtSwapData = {
  // icETH
  '0x7C07F7aBe10CE8e33DC6C5aD68FE033085256A84': {
    exchange: Exchange.Curve,
    path: ['0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', ETH.address],
    fees: [],
    pool: '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022',
  },
  // ETH2x-FLI-P
  '0x3Ad707dA309f3845cd602059901E39C4dcd66473': {
    exchange: Exchange.Sushiswap,
    path: ['0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'],
    fees: [],
    pool: '0x34965ba0ac2451a34a0471f04cca3f990b8dea27',
  },
}

export const debtCollateralSwapData = {
  // icETH
  '0x7C07F7aBe10CE8e33DC6C5aD68FE033085256A84': {
    exchange: Exchange.Curve,
    path: [ETH.address, '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84'],
    fees: [],
    pool: '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022',
  },
  // ETH2x-FLI-P
  '0x3Ad707dA309f3845cd602059901E39C4dcd66473': {
    path: ['0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'],
    exchange: Exchange.Sushiswap,
    fees: [],
    pool: '0x34965ba0ac2451a34a0471f04cca3f990b8dea27',
  },
}

export const inputSwapData = {
  // icETH
  '0x7C07F7aBe10CE8e33DC6C5aD68FE033085256A84': {
    // icETH only supports ETH as the input token
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': {
      exchange: Exchange.None,
      path: [],
      fees: [],
      pool: ADDRESS_ZERO,
    },
  },
  // ETH2x-FLI-P
  '0x3Ad707dA309f3845cd602059901E39C4dcd66473': {
    // ETHX-FLI-P only supports USDC as the input token
    '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174': {
      exchange: Exchange.None,
      path: [],
      fees: [],
      pool: ADDRESS_ZERO,
    },
  },
}

export const outputSwapData = {
  // icETH
  '0x7C07F7aBe10CE8e33DC6C5aD68FE033085256A84': {
    // icETH only supports ETH as the output token
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': {
      exchange: Exchange.None,
      path: [],
      fees: [],
      pool: ADDRESS_ZERO,
    },
  },
}
