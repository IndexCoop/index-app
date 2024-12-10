import {
  DebtIssuanceModuleAddress,
  DebtIssuanceModuleV2Address,
  IndexDebtIssuanceModuleV2Address,
  IndexDebtIssuanceModuleV2Address_v2,
} from '@indexcoop/flash-mint-sdk'

import {
  BedIndex,
  Bitcoin2xFlexibleLeverageIndex,
  DATA,
  Ethereum2xFlexibleLeverageIndex,
  GitcoinStakedETHIndex,
  GmiIndex,
  ic21,
  LeveragedRethStakingYield,
} from '@/constants/tokens'

export const Issuance = {
  [BedIndex.symbol]: IndexDebtIssuanceModuleV2Address_v2,
  [Bitcoin2xFlexibleLeverageIndex.symbol]: DebtIssuanceModuleV2Address,
  [DATA.symbol]: DebtIssuanceModuleAddress,
  [Ethereum2xFlexibleLeverageIndex.symbol]: DebtIssuanceModuleV2Address,
  [GitcoinStakedETHIndex.symbol]: IndexDebtIssuanceModuleV2Address,
  [GmiIndex.symbol]: DebtIssuanceModuleAddress,
  [ic21.symbol]: IndexDebtIssuanceModuleV2Address_v2,
  [LeveragedRethStakingYield.symbol]: IndexDebtIssuanceModuleV2Address_v2,
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
