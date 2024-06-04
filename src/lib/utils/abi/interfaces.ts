import { utils } from 'ethers'

import { ERC20_ABI } from './ERC20'

// Export for viem/wagmi
export { ERC20_ABI } from './ERC20'
export { FlashMintLeveragedExtendedAbi } from './flash-mint-leveraged-extended-abi'
// Export for ethers related code
export const ERC20Interface = new utils.Interface(ERC20_ABI)
