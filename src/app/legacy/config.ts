import {
  IndexDebtIssuanceModuleV2Address,
  IndexDebtIssuanceModuleV2Address_v2,
} from '@indexcoop/flash-mint-sdk'

import {
  BedIndex,
  GitcoinStakedETHIndex,
  ic21,
  LeveragedRethStakingYield,
} from '@/constants/tokens'

export const Issuance = {
  [BedIndex.symbol]: IndexDebtIssuanceModuleV2Address_v2,
  [GitcoinStakedETHIndex.symbol]: IndexDebtIssuanceModuleV2Address,
  [ic21.symbol]: IndexDebtIssuanceModuleV2Address_v2,
  [LeveragedRethStakingYield.symbol]: IndexDebtIssuanceModuleV2Address_v2,
}

export const LegacyTokenList = [
  ic21,
  GitcoinStakedETHIndex,
  LeveragedRethStakingYield,
  BedIndex,
]
