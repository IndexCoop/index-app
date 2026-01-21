import { IndexDebtIssuanceModuleV2Address_v2 } from '@indexcoop/flash-mint-sdk'

import {
  BedIndex,
  Bitcoin2xFlexibleLeverageIndex,
  DATA,
  DPI,
  Ethereum2xFlexibleLeverageIndex,
  GMI,
  GitcoinStakedETHIndex,
  LeveragedRethStakingYield,
  MVI,
  cdETI,
  dsETH,
  ic21,
} from './tokens/mainnet'
import {
  Bitcoin2xFlexibleLeverageIndexPolygon,
  ETH2xFlexibleLeverageIndexPolygon,
  InverseBTCFlexibleLeverageIndexPolygon,
  InverseETHFlexibleLeverageIndexPolygon,
  InverseMATICFlexibleLeverageIndexPolygon,
  Matic2xFlexibleLeverageIndexPolygon,
} from './tokens/polygon'

import type { LegacyToken } from '@/app/legacy/types'

const DebtIssuanceModuleAddress = '0x39F024d621367C044BacE2bf0Fb15Fb3612eCB92'

const DebtIssuanceModuleV2PolygonAddress =
  '0xf2dC2f456b98Af9A6bEEa072AF152a7b0EaA40C9'

const Eth2xFliRedemptionHelper = '0x5Efda1DBD6ADcEe04CF8Bd6599af3D9b2c8Fc85f'
const Btc2xFliRedemptionHelper = '0xD7937c7cbE8BE535d536f8BEF0c301651E400852'

export const Issuance: { [key: string]: string } = {
  [BedIndex.symbol]: DebtIssuanceModuleAddress,
  [Bitcoin2xFlexibleLeverageIndex.symbol]: Btc2xFliRedemptionHelper,
  [Bitcoin2xFlexibleLeverageIndexPolygon.symbol]:
    DebtIssuanceModuleV2PolygonAddress,
  [cdETI.symbol]: IndexDebtIssuanceModuleV2Address_v2,
  [DATA.symbol]: DebtIssuanceModuleAddress,
  [dsETH.symbol]: IndexDebtIssuanceModuleV2Address_v2,
  [Ethereum2xFlexibleLeverageIndex.symbol]: Eth2xFliRedemptionHelper,
  [ETH2xFlexibleLeverageIndexPolygon.symbol]:
    DebtIssuanceModuleV2PolygonAddress,
  [GMI.symbol]: DebtIssuanceModuleAddress,
  [GitcoinStakedETHIndex.symbol]: '0x04b59F9F09750C044D7CfbC177561E409085f0f3', // unique DIM for gtcETH
  [ic21.symbol]: IndexDebtIssuanceModuleV2Address_v2,
  [InverseBTCFlexibleLeverageIndexPolygon.symbol]:
    DebtIssuanceModuleV2PolygonAddress,
  [InverseETHFlexibleLeverageIndexPolygon.symbol]:
    DebtIssuanceModuleV2PolygonAddress,
  [InverseMATICFlexibleLeverageIndexPolygon.symbol]:
    DebtIssuanceModuleV2PolygonAddress,
  [LeveragedRethStakingYield.symbol]: IndexDebtIssuanceModuleV2Address_v2,
  [Matic2xFlexibleLeverageIndexPolygon.symbol]:
    DebtIssuanceModuleV2PolygonAddress,
  [MVI.symbol]: DebtIssuanceModuleAddress,
  [DPI.symbol]: DebtIssuanceModuleAddress,
}

export const LegacyTokenList: LegacyToken[] = [
  {
    ...Bitcoin2xFlexibleLeverageIndex,
    image: Bitcoin2xFlexibleLeverageIndex.logoURI,
  },
  {
    ...Ethereum2xFlexibleLeverageIndex,
    image: Ethereum2xFlexibleLeverageIndex.logoURI,
  },
  { ...cdETI, image: cdETI.logoURI },
  { ...dsETH, image: dsETH.logoURI },
  { ...ic21, image: ic21.logoURI },
  { ...GitcoinStakedETHIndex, image: GitcoinStakedETHIndex.logoURI },
  { ...GMI, image: GMI.logoURI },
  { ...DATA, image: DATA.logoURI },
  { ...LeveragedRethStakingYield, image: LeveragedRethStakingYield.logoURI },
  { ...BedIndex, image: BedIndex.logoURI },
  {
    ...DPI,
    image: DPI.logoURI,
  },
  {
    ...MVI,
    image: MVI.logoURI,
  },
]

export const PolygonLegacyTokenList = [
  Bitcoin2xFlexibleLeverageIndexPolygon,
  ETH2xFlexibleLeverageIndexPolygon,
  Matic2xFlexibleLeverageIndexPolygon,
  InverseBTCFlexibleLeverageIndexPolygon,
  InverseETHFlexibleLeverageIndexPolygon,
  InverseMATICFlexibleLeverageIndexPolygon,
]
