import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import { polygon } from 'viem/chains'

const btc2xflip = getTokenByChainAndSymbol(polygon.id, 'BTC2x-FLI-P')
export const Bitcoin2xFlexibleLeverageIndexPolygon = {
  ...btc2xflip,
  image: btc2xflip.logoURI,
}

const eth2xflip = getTokenByChainAndSymbol(polygon.id, 'ETH2x-FLI-P')
export const ETH2xFlexibleLeverageIndexPolygon = {
  ...eth2xflip,
  image: eth2xflip.logoURI,
}

const ibtcflip = getTokenByChainAndSymbol(polygon.id, 'iBTC-FLI-P')
export const InverseBTCFlexibleLeverageIndexPolygon = {
  ...ibtcflip,
  image: ibtcflip.logoURI,
}

const iethflip = getTokenByChainAndSymbol(polygon.id, 'iETH-FLI-P')
export const InverseETHFlexibleLeverageIndexPolygon = {
  ...iethflip,
  image: iethflip.logoURI,
}

const imaticflip = getTokenByChainAndSymbol(polygon.id, 'iMATIC-FLI-P')
export const InverseMATICFlexibleLeverageIndexPolygon = {
  ...imaticflip,
  image: imaticflip.logoURI,
}

const matic2xflip = getTokenByChainAndSymbol(polygon.id, 'MATIC2x-FLI-P')
export const Matic2xFlexibleLeverageIndexPolygon = {
  ...matic2xflip,
  image: matic2xflip.logoURI,
}
