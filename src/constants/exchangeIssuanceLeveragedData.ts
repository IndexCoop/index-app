import { Exchange } from 'utils/exchangeIssuanceQuotes'

import { ETH, Ethereum2xFLIP, icETHIndex, MATIC } from './tokens'

const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export const collateralDebtSwapData = {
  [icETHIndex.symbol]: {
    exchange: Exchange.Curve,
    path: ['0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', ETH.address],
    fees: [],
    pool: '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022',
  },
  [Ethereum2xFLIP.symbol]: {
    exchange: Exchange.Sushiswap,
    path: [
      '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
      '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    ],
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
    exchange: Exchange.Sushiswap,
    path: [
      '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    ],
    fees: [],
    pool: ADDRESS_ZERO,
  },
}

export const inputSwapData = {
  // icETH
  '0x7C07F7aBe10CE8e33DC6C5aD68FE033085256A84': {
    // icETH only supports ETH as the input token
    '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE': {
      exchange: Exchange.Curve,
      path: [ETH.address, '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84'],
      fees: [],
      pool: '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022',
    },
  },
  // ETH2x-FLI-P
  '0x3Ad707dA309f3845cd602059901E39C4dcd66473': {
    // USDC
    '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174': {
      exchange: Exchange.Sushiswap,
      path: [
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
      fees: [],
      pool: ADDRESS_ZERO,
    },
    // DAI
    '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063': {
      exchange: Exchange.Sushiswap,
      path: [
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
      fees: [],
      pool: ADDRESS_ZERO,
    },
    // MATIC
    '0x0000000000000000000000000000000000001010': {
      exchange: Exchange.Sushiswap,
      path: [
        '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
      fees: [],
      pool: ADDRESS_ZERO,
    },
  },
}

export const outputSwapData = {
  [icETHIndex.symbol]: {
    // icETH only supports ETH as the output token
    [ETH.symbol]: {
      exchange: Exchange.Curve,
      path: ['0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', ETH.address],
      fees: [],
      pool: '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022',
    },
  },
}
