import { utils } from 'ethers'

import { ISSUANCE_ABI } from 'utils/abi/Issuance'

export const FlashMintPerpInterface = new utils.Interface(ISSUANCE_ABI)
