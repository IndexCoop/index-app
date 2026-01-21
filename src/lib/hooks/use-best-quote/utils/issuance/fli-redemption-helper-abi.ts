export const FliRedemptionHelperAbi = [
  {
    inputs: [
      { name: '_fliAmount', type: 'uint256' },
      { name: '_to', type: 'address' },
    ],
    name: 'redeem',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: '_fliAmount', type: 'uint256' }],
    name: 'getNestedTokenReceivedOnRedemption',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const
