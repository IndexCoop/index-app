export const EI_LEVERAGED_ABI = [
  {
    inputs: [
      { internalType: 'address', name: '_weth', type: 'address' },
      {
        internalType: 'contract IUniswapV2Router02',
        name: '_quickRouter',
        type: 'address',
      },
      {
        internalType: 'contract IUniswapV2Router02',
        name: '_sushiRouter',
        type: 'address',
      },
      {
        internalType: 'contract ISwapRouter',
        name: '_uniV3Router',
        type: 'address',
      },
      {
        internalType: 'contract IController',
        name: '_setController',
        type: 'address',
      },
      {
        internalType: 'contract IDebtIssuanceModule',
        name: '_debtIssuanceModule',
        type: 'address',
      },
      {
        internalType: 'contract IAaveLeverageModule',
        name: '_aaveLeverageModule',
        type: 'address',
      },
      { internalType: 'address', name: '_addressProvider', type: 'address' },
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
        name: '_recipient',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'contract ISetToken',
        name: '_setToken',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_inputToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_amountInputToken',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_amountSetIssued',
        type: 'uint256',
      },
    ],
    name: 'ExchangeIssue',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_recipient',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'contract ISetToken',
        name: '_setToken',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_outputToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_amountSetRedeemed',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_amountOutputToken',
        type: 'uint256',
      },
    ],
    name: 'ExchangeRedeem',
    type: 'event',
  },
  {
    inputs: [],
    name: 'ADDRESSES_PROVIDER',
    outputs: [
      {
        internalType: 'contract ILendingPoolAddressesProviderV2',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ETH_ADDRESS',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'LENDING_POOL',
    outputs: [
      { internalType: 'contract ILendingPoolV2', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'POOL_FEE',
    outputs: [{ internalType: 'uint24', name: '', type: 'uint24' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'WETH',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'aaveLeverageModule',
    outputs: [
      {
        internalType: 'contract IAaveLeverageModule',
        name: '',
        type: 'address',
      },
    ],
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
    ],
    name: 'approveSetToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'contract IERC20', name: '_token', type: 'address' },
    ],
    name: 'approveToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'contract IERC20[]', name: '_tokens', type: 'address[]' },
    ],
    name: 'approveTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'debtIssuanceModule',
    outputs: [
      {
        internalType: 'contract IDebtIssuanceModule',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address[]', name: 'assets', type: 'address[]' },
      { internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' },
      { internalType: 'uint256[]', name: 'premiums', type: 'uint256[]' },
      { internalType: 'address', name: 'initiator', type: 'address' },
      { internalType: 'bytes', name: 'params', type: 'bytes' },
    ],
    name: 'executeOperation',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
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
      { internalType: 'uint256', name: '_setAmount', type: 'uint256' },
      { internalType: 'bool', name: '_isIssuance', type: 'bool' },
    ],
    name: 'getLeveragedTokenData',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'collateralAToken',
            type: 'address',
          },
          { internalType: 'address', name: 'collateralToken', type: 'address' },
          {
            internalType: 'uint256',
            name: 'collateralAmount',
            type: 'uint256',
          },
          { internalType: 'address', name: 'debtToken', type: 'address' },
          { internalType: 'uint256', name: 'debtAmount', type: 'uint256' },
        ],
        internalType: 'struct ExchangeIssuanceLeveraged.LeveragedTokenData',
        name: '',
        type: 'tuple',
      },
    ],
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
      { internalType: 'uint256', name: '_setAmount', type: 'uint256' },
      { internalType: 'address', name: '_inputToken', type: 'address' },
      {
        internalType: 'uint256',
        name: '_maxAmountInputToken',
        type: 'uint256',
      },
      {
        internalType: 'enum DEXAdapter.Exchange',
        name: '_exchange',
        type: 'uint8',
      },
      {
        components: [
          { internalType: 'address[]', name: 'path', type: 'address[]' },
          { internalType: 'uint24[]', name: 'fees', type: 'uint24[]' },
        ],
        internalType: 'struct DEXAdapter.SwapData',
        name: '_swapDataDebtForCollateral',
        type: 'tuple',
      },
      {
        components: [
          { internalType: 'address[]', name: 'path', type: 'address[]' },
          { internalType: 'uint24[]', name: 'fees', type: 'uint24[]' },
        ],
        internalType: 'struct DEXAdapter.SwapData',
        name: '_swapDataInputToken',
        type: 'tuple',
      },
    ],
    name: 'issueExactSetFromERC20',
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
      { internalType: 'uint256', name: '_setAmount', type: 'uint256' },
      {
        internalType: 'enum DEXAdapter.Exchange',
        name: '_exchange',
        type: 'uint8',
      },
      {
        components: [
          { internalType: 'address[]', name: 'path', type: 'address[]' },
          { internalType: 'uint24[]', name: 'fees', type: 'uint24[]' },
        ],
        internalType: 'struct DEXAdapter.SwapData',
        name: '_swapDataDebtForCollateral',
        type: 'tuple',
      },
      {
        components: [
          { internalType: 'address[]', name: 'path', type: 'address[]' },
          { internalType: 'uint24[]', name: 'fees', type: 'uint24[]' },
        ],
        internalType: 'struct DEXAdapter.SwapData',
        name: '_swapDataInputToken',
        type: 'tuple',
      },
    ],
    name: 'issueExactSetFromETH',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'quickRouter',
    outputs: [
      {
        internalType: 'contract IUniswapV2Router02',
        name: '',
        type: 'address',
      },
    ],
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
      { internalType: 'uint256', name: '_setAmount', type: 'uint256' },
      { internalType: 'address', name: '_outputToken', type: 'address' },
      {
        internalType: 'uint256',
        name: '_minAmountOutputToken',
        type: 'uint256',
      },
      {
        internalType: 'enum DEXAdapter.Exchange',
        name: '_exchange',
        type: 'uint8',
      },
      {
        components: [
          { internalType: 'address[]', name: 'path', type: 'address[]' },
          { internalType: 'uint24[]', name: 'fees', type: 'uint24[]' },
        ],
        internalType: 'struct DEXAdapter.SwapData',
        name: '_swapDataCollateralForDebt',
        type: 'tuple',
      },
      {
        components: [
          { internalType: 'address[]', name: 'path', type: 'address[]' },
          { internalType: 'uint24[]', name: 'fees', type: 'uint24[]' },
        ],
        internalType: 'struct DEXAdapter.SwapData',
        name: '_swapDataOutputToken',
        type: 'tuple',
      },
    ],
    name: 'redeemExactSetForERC20',
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
      { internalType: 'uint256', name: '_setAmount', type: 'uint256' },
      {
        internalType: 'uint256',
        name: '_minAmountOutputToken',
        type: 'uint256',
      },
      {
        internalType: 'enum DEXAdapter.Exchange',
        name: '_exchange',
        type: 'uint8',
      },
      {
        components: [
          { internalType: 'address[]', name: 'path', type: 'address[]' },
          { internalType: 'uint24[]', name: 'fees', type: 'uint24[]' },
        ],
        internalType: 'struct DEXAdapter.SwapData',
        name: '_swapDataCollateralForDebt',
        type: 'tuple',
      },
      {
        components: [
          { internalType: 'address[]', name: 'path', type: 'address[]' },
          { internalType: 'uint24[]', name: 'fees', type: 'uint24[]' },
        ],
        internalType: 'struct DEXAdapter.SwapData',
        name: '_swapDataOutputToken',
        type: 'tuple',
      },
    ],
    name: 'redeemExactSetForETH',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'setController',
    outputs: [
      { internalType: 'contract IController', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'sushiRouter',
    outputs: [
      {
        internalType: 'contract IUniswapV2Router02',
        name: '',
        type: 'address',
      },
    ],
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
  { stateMutability: 'payable', type: 'receive' },
]
