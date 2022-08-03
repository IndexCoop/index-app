export const PerpV2LeverageModuleViewerABI = [
  {
    inputs: [
      {
        internalType: 'contract IPerpV2LeverageModuleV2',
        name: '_perpModule',
        type: 'address',
      },
      {
        internalType: 'contract IAccountBalance',
        name: '_perpAccountBalance',
        type: 'address',
      },
      {
        internalType: 'contract IClearingHouseConfig',
        name: '_perpClearingHouseConfig',
        type: 'address',
      },
      { internalType: 'contract ERC20', name: '_vQuoteToken', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'collateralToken',
    outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
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
      { internalType: 'int256', name: '_slippage', type: 'int256' },
    ],
    name: 'getMaximumSetTokenIssueAmount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
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
    name: 'getTotalCollateralUnit',
    outputs: [
      { internalType: 'contract IERC20', name: '', type: 'address' },
      { internalType: 'int256', name: '', type: 'int256' },
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
    name: 'getVirtualAssetsDisplayInfo',
    outputs: [
      {
        components: [
          { internalType: 'string', name: 'symbol', type: 'string' },
          { internalType: 'address', name: 'vAssetAddress', type: 'address' },
          { internalType: 'int256', name: 'positionUnit', type: 'int256' },
          { internalType: 'uint256', name: 'indexPrice', type: 'uint256' },
          {
            internalType: 'int256',
            name: 'currentLeverageRatio',
            type: 'int256',
          },
        ],
        internalType: 'struct PerpV2LeverageModuleViewer.VAssetDisplayInfo[]',
        name: 'assetInfo',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'perpAccountBalance',
    outputs: [
      { internalType: 'contract IAccountBalance', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'perpClearingHouseConfig',
    outputs: [
      {
        internalType: 'contract IClearingHouseConfig',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'perpModule',
    outputs: [
      {
        internalType: 'contract IPerpV2LeverageModuleV2',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'vQuoteToken',
    outputs: [{ internalType: 'contract ERC20', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
]
