import {
  DebtIssuanceModuleAddress,
  DebtIssuanceModuleV2Address,
  DebtIssuanceModuleV2PolygonAddress,
  IndexDebtIssuanceModuleV2Address,
  IndexDebtIssuanceModuleV2Address_v2,
} from '@indexcoop/flash-mint-sdk'
import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'

import {
  BedIndex,
  Bitcoin2xFlexibleLeverageIndex,
  DATA,
  Ethereum2xFlexibleLeverageIndex,
  GitcoinStakedETHIndex,
  GmiIndex,
  LeveragedRethStakingYield,
} from '@/constants/tokens'

import {
  Bitcoin2xFlexibleLeverageIndexPolygon,
  ETH2xFlexibleLeverageIndexPolygon,
  InverseBTCFlexibleLeverageIndexPolygon,
  InverseETHFlexibleLeverageIndexPolygon,
  InverseMATICFlexibleLeverageIndexPolygon,
  Matic2xFlexibleLeverageIndexPolygon,
} from './polygon'

const ic21 = getTokenByChainAndSymbol(1, 'ic21')

export const Issuance = {
  [BedIndex.symbol]: IndexDebtIssuanceModuleV2Address_v2,
  [Bitcoin2xFlexibleLeverageIndex.symbol]: DebtIssuanceModuleV2Address,
  [Bitcoin2xFlexibleLeverageIndexPolygon.symbol]:
    DebtIssuanceModuleV2PolygonAddress,
  [DATA.symbol]: DebtIssuanceModuleAddress,
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

export const LegacyTokenList = [
  Bitcoin2xFlexibleLeverageIndex,
  Ethereum2xFlexibleLeverageIndex,
  ic21,
  GitcoinStakedETHIndex,
  GmiIndex,
  DATA,
  LeveragedRethStakingYield,
  BedIndex,
]

export const PolygonLegacyTokenList = [
  Bitcoin2xFlexibleLeverageIndexPolygon,
  ETH2xFlexibleLeverageIndexPolygon,
  Matic2xFlexibleLeverageIndexPolygon,
  InverseBTCFlexibleLeverageIndexPolygon,
  InverseETHFlexibleLeverageIndexPolygon,
  InverseMATICFlexibleLeverageIndexPolygon,
]
