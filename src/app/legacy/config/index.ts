import {
  DebtIssuanceModuleV2Address,
  IndexDebtIssuanceModuleV2Address,
  IndexDebtIssuanceModuleV2Address_v2,
} from '@indexcoop/flash-mint-sdk'

import { LegacyToken } from '@/app/legacy/types'
import { DATA, GmiIndex } from '@/constants/tokens'

import {
  BedIndex,
  Bitcoin2xFlexibleLeverageIndex,
  Ethereum2xFlexibleLeverageIndex,
  GitcoinStakedETHIndex,
  LeveragedRethStakingYield,
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

const DebtIssuanceModuleAddress = '0x39F024d621367C044BacE2bf0Fb15Fb3612eCB92'
const DebtIssuanceModuleV2PolygonAddress =
  '0xf2dC2f456b98Af9A6bEEa072AF152a7b0EaA40C9'

export const Issuance = {
  [BedIndex.symbol]: DebtIssuanceModuleAddress,
  [Bitcoin2xFlexibleLeverageIndex.symbol]: DebtIssuanceModuleV2Address,
  [Bitcoin2xFlexibleLeverageIndexPolygon.symbol]:
    DebtIssuanceModuleV2PolygonAddress,
  [DATA.symbol]: DebtIssuanceModuleAddress,
  [dsETH.symbol]: IndexDebtIssuanceModuleV2Address_v2,
  [Ethereum2xFlexibleLeverageIndex.symbol]: DebtIssuanceModuleV2Address,
  [ETH2xFlexibleLeverageIndexPolygon.symbol]:
    DebtIssuanceModuleV2PolygonAddress,
  [GitcoinStakedETHIndex.symbol]: IndexDebtIssuanceModuleV2Address,
  [GmiIndex.symbol]: DebtIssuanceModuleAddress,
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
  { ...dsETH, image: dsETH.logoURI },
  { ...ic21, image: ic21.logoURI },
  { ...GitcoinStakedETHIndex, image: GitcoinStakedETHIndex.logoURI },
  GmiIndex,
  DATA,
  { ...LeveragedRethStakingYield, image: LeveragedRethStakingYield.logoURI },
  { ...BedIndex, image: BedIndex.logoURI },
]

export const PolygonLegacyTokenList = [
  Bitcoin2xFlexibleLeverageIndexPolygon,
  ETH2xFlexibleLeverageIndexPolygon,
  Matic2xFlexibleLeverageIndexPolygon,
  InverseBTCFlexibleLeverageIndexPolygon,
  InverseETHFlexibleLeverageIndexPolygon,
  InverseMATICFlexibleLeverageIndexPolygon,
]
