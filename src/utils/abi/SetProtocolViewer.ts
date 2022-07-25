export const SetProtocolViewerAbi = [
  {
    inputs: [
      {
        internalType: 'contract ISetToken[]',
        name: '_setTokens',
        type: 'address[]',
      },
      {
        internalType: 'address[]',
        name: '_moduleList',
        type: 'address[]',
      },
    ],
    name: 'batchFetchDetails',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'symbol',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'manager',
            type: 'address',
          },
          {
            internalType: 'address[]',
            name: 'modules',
            type: 'address[]',
          },
          {
            internalType: 'enum ISetToken.ModuleState[]',
            name: 'moduleStatuses',
            type: 'uint8[]',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'component',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'module',
                type: 'address',
              },
              {
                internalType: 'int256',
                name: 'unit',
                type: 'int256',
              },
              {
                internalType: 'uint8',
                name: 'positionState',
                type: 'uint8',
              },
              {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
              },
            ],
            internalType: 'struct ISetToken.Position[]',
            name: 'positions',
            type: 'tuple[]',
          },
          {
            internalType: 'uint256',
            name: 'totalSupply',
            type: 'uint256',
          },
        ],
        internalType: 'struct SetTokenViewer.SetDetails[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract ISetToken[]',
        name: '_setTokens',
        type: 'address[]',
      },
    ],
    name: 'batchFetchManagers',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract ISetToken[]',
        name: '_setTokens',
        type: 'address[]',
      },
      {
        internalType: 'address[]',
        name: '_modules',
        type: 'address[]',
      },
    ],
    name: 'batchFetchModuleStates',
    outputs: [
      {
        internalType: 'enum ISetToken.ModuleState[][]',
        name: '',
        type: 'uint8[][]',
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
      {
        internalType: 'address[]',
        name: '_moduleList',
        type: 'address[]',
      },
    ],
    name: 'getSetDetails',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'symbol',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'manager',
            type: 'address',
          },
          {
            internalType: 'address[]',
            name: 'modules',
            type: 'address[]',
          },
          {
            internalType: 'enum ISetToken.ModuleState[]',
            name: 'moduleStatuses',
            type: 'uint8[]',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'component',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'module',
                type: 'address',
              },
              {
                internalType: 'int256',
                name: 'unit',
                type: 'int256',
              },
              {
                internalType: 'uint8',
                name: 'positionState',
                type: 'uint8',
              },
              {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
              },
            ],
            internalType: 'struct ISetToken.Position[]',
            name: 'positions',
            type: 'tuple[]',
          },
          {
            internalType: 'uint256',
            name: 'totalSupply',
            type: 'uint256',
          },
        ],
        internalType: 'struct SetTokenViewer.SetDetails',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]
