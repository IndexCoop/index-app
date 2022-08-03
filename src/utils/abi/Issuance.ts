export const ISSUANCE_ABI = [
  {
    inputs: [
      {
        internalType: 'contract ISwapRouter',
        name: '_uniV3Router',
        type: 'address',
      },
      {
        internalType: 'contract IQuoter',
        name: '_uniV3Quoter',
        type: 'address',
      },
      {
        internalType: 'contract ISlippageIssuanceModule',
        name: '_slippageIssuanceModule',
        type: 'address',
      },
      { internalType: 'contract IERC20', name: '_usdc', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_assetAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'LogWithdraw',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: '_token', type: 'address' },
      { internalType: 'address', name: '_spender', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract ISetToken',
        name: '_setToken',
        type: 'address',
      },
      { internalType: 'uint256', name: '_amountOut', type: 'uint256' },
    ],
    name: 'getUsdcAmountInForFixedSetOffChain',
    outputs: [
      { internalType: 'uint256', name: 'totalUsdcAmountIn', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract ISetToken',
        name: '_setToken',
        type: 'address',
      },
      { internalType: 'uint256', name: '_amountIn', type: 'uint256' },
    ],
    name: 'getUsdcAmountOutForFixedSetOffChain',
    outputs: [
      { internalType: 'uint256', name: 'totalUsdcAmountOut', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract ISetToken',
        name: '_setToken',
        type: 'address',
      },
      { internalType: 'bytes', name: '_spotToUsdcRoute', type: 'bytes' },
      { internalType: 'address', name: '_spotToken', type: 'address' },
    ],
    name: 'initializeSet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'contract ISetToken', name: '', type: 'address' }],
    name: 'initializedSets',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract ISetToken',
        name: '_setToken',
        type: 'address',
      },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'uint256', name: '_maxAmountIn', type: 'uint256' },
    ],
    name: 'issueFixedSetFromUsdc',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract ISetToken',
        name: '_setToken',
        type: 'address',
      },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'uint256', name: '_minAmountOut', type: 'uint256' },
    ],
    name: 'redeemFixedSetForUsdc',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract ISetToken',
        name: '_setToken',
        type: 'address',
      },
    ],
    name: 'removeSet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'contract ISetToken', name: '', type: 'address' }],
    name: 'setPoolInfo',
    outputs: [
      { internalType: 'bytes', name: 'spotToUsdcRoute', type: 'bytes' },
      { internalType: 'address', name: 'spotToken', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'slippageIssuanceModule',
    outputs: [
      {
        internalType: 'contract ISlippageIssuanceModule',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'uniV3Quoter',
    outputs: [{ internalType: 'contract IQuoter', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'uniV3Router',
    outputs: [
      { internalType: 'contract ISwapRouter', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'usdc',
    outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_assetAddress', type: 'address' },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
