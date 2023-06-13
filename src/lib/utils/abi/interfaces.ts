import { utils } from 'ethers'

import { ERC20_ABI } from './ERC20'
import { ISSUANCE_ABI } from './Issuance'

export const ERC20Interface = new utils.Interface(ERC20_ABI)

export const FlashMintPerpInterface = new utils.Interface(ISSUANCE_ABI)
