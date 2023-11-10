import { utils } from 'ethers'

import { ERC20_ABI } from './ERC20'

export { ERC20_ABI } from './ERC20'
export const ERC20Interface = new utils.Interface(ERC20_ABI)
