import { utils } from 'ethers'

import { ERC20_ABI } from 'utils/abi/ERC20'
import { ISSUANCE_ABI } from 'utils/abi/Issuance'

export const ERC20Interface = new utils.Interface(ERC20_ABI)

export const FlashMintPerpInterface = new utils.Interface(ISSUANCE_ABI)
