// import { Exchange } from 'utils/exchangeIssuanceQuotes'

import { ETH, Ethereum2xFLIP, icETHIndex, STETH } from './tokens'

const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

enum Exchange {
  None,
  Quickswap,
  Sushiswap,
  UniV3,
  Curve,
}

export const collateralDebtSwapData = {
  [icETHIndex.symbol]: {
    exchange: Exchange.Curve,
    path: ['0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', ETH.address!],
    fees: [],
    pool: '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022',
  },
  [Ethereum2xFLIP.symbol]: {
    exchange: Exchange.Sushiswap,
    path: [
      '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
      '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    ],
    fees: [],
    pool: '0x34965ba0ac2451a34a0471f04cca3f990b8dea27',
  },
}

export const debtCollateralSwapData = {
  // icETH
  [icETHIndex.symbol]: {
    exchange: Exchange.Curve,
    path: [ETH.address!, '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84'],
    fees: [],
    pool: '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022',
  },
  // ETH2x-FLI-P
  [Ethereum2xFLIP.symbol]: {
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
  [icETHIndex.symbol]: {
    // icETH only supports ETH as the input token
    [ETH.symbol]: {
      exchange: Exchange.Curve,
      path: [ETH.address!, STETH.address!],
      fees: [],
      pool: '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022',
    },
    [STETH.symbol]: {
      exchange: Exchange.Curve,
      path: [STETH.address!],
      fees: [],
      pool: '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022',
    },
  },
  // // ETH2x-FLI-P
  // '0x3Ad707dA309f3845cd602059901E39C4dcd66473': {
  //   // USDC
  //   '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174': {
  //     exchange: Exchange.Sushiswap,
  //     path: [
  //       '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  //       '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  //     ],
  //     fees: [],
  //     pool: ADDRESS_ZERO,
  //   },
  //   // DAI
  //   '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063': {
  //     exchange: Exchange.Sushiswap,
  //     path: [
  //       '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  //       '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  //     ],
  //     fees: [],
  //     pool: ADDRESS_ZERO,
  //   },
  //   // MATIC
  //   '0x0000000000000000000000000000000000001010': {
  //     exchange: Exchange.Sushiswap,
  //     path: [
  //       '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
  //       '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  //     ],
  //     fees: [],
  //     pool: ADDRESS_ZERO,
  //   },
  // },
}

export const outputSwapData = {
  [icETHIndex.symbol]: {
    // icETH only supports ETH as the output token
    [ETH.symbol]: {
      exchange: Exchange.Curve,
      path: ['0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', ETH.address!],
      fees: [],
      pool: '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022',
    },
  },
}
