import { Exchange } from 'utils/exchangeIssuanceQuotes'

import { ETH } from './tokens'

const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export const collateralDebtSwapData = {
  // icETH
  '0x7C07F7aBe10CE8e33DC6C5aD68FE033085256A84': {
    exchange: Exchange.Curve,
    path: ['0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', ETH.address],
    fees: [],
    pool: '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022',
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
