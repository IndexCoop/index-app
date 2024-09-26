import {
  IndexDebtIssuanceModuleV2Address,
  IndexDebtIssuanceModuleV2Address_v2,
} from '@indexcoop/flash-mint-sdk'

import {
  BedIndex,
  GitcoinStakedETHIndex,
  LeveragedRethStakingYield,
} from '@/constants/tokens'

export const Issuance = {
  [BedIndex.symbol]: IndexDebtIssuanceModuleV2Address_v2,
  [GitcoinStakedETHIndex.symbol]: IndexDebtIssuanceModuleV2Address,
  [LeveragedRethStakingYield.symbol]: IndexDebtIssuanceModuleV2Address_v2,
}

export const LegacyTokenList = [
  GitcoinStakedETHIndex,
  LeveragedRethStakingYield,
  BedIndex,
]
