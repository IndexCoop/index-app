import {
  DebtIssuanceModuleAddress,
  IndexDebtIssuanceModuleV2Address,
  IndexDebtIssuanceModuleV2Address_v2,
} from '@indexcoop/flash-mint-sdk'

import {
  BedIndex,
  DATA,
  GitcoinStakedETHIndex,
  GmiIndex,
  ic21,
  LeveragedRethStakingYield,
} from '@/constants/tokens'

export const Issuance = {
  [BedIndex.symbol]: IndexDebtIssuanceModuleV2Address_v2,
  [DATA.symbol]: DebtIssuanceModuleAddress,
  [GitcoinStakedETHIndex.symbol]: IndexDebtIssuanceModuleV2Address,
  [GmiIndex.symbol]: DebtIssuanceModuleAddress,
  [ic21.symbol]: IndexDebtIssuanceModuleV2Address_v2,
  [LeveragedRethStakingYield.symbol]: IndexDebtIssuanceModuleV2Address_v2,
}

export const LegacyTokenList = [
  ic21,
  GitcoinStakedETHIndex,
  GmiIndex,
  DATA,
  LeveragedRethStakingYield,
  BedIndex,
]
