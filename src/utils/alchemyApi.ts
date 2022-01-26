import {
  BedIndex,
  Bitcoin2xFlexibleLeverageIndex,
  DataIndex,
  DefiPulseIndex,
  Ethereum2xFlexibleLeverageIndex,
  GmiIndex,
  IndexToken,
  MetaverseIndex,
} from 'constants/productTokens'

const alchemyApiUrl = process.env.REACT_APP_ALCHEMY_API

const contractAddresses: string[] = [
  BedIndex.address!,
  Bitcoin2xFlexibleLeverageIndex.address!,
  DataIndex.address!,
  DefiPulseIndex.address!,
  Ethereum2xFlexibleLeverageIndex.address!,
  GmiIndex.address!,
  IndexToken.address!,
  MetaverseIndex.address!,
]

interface AlchemyApiParams {
  fromBlock: string
  toBlock: string
  contractAddresses: string[]
  fromAddress?: string | null
  toAddress?: string | null
  maxCount: string
  excludeZeroValue: boolean
  category: string[]
}

export interface AlchemyApiTransaction {
  asset: string
  blockNum: string
  category: string
  erc721TokenId: string | null
  erc1155Metadata: string | null
  from: string
  hash: string
  rawContract: {
    value: string
    address: string
    decimal: string
  }
  to: string
  tokenId: string | null
  value: number
}

const fetchTransactionHistory = async (
  fromAddress: string | null = null,
  toAddress: string | null = null
): Promise<AlchemyApiTransaction[]> => {
  if (alchemyApiUrl === undefined) return []

  const params: AlchemyApiParams[] = [
    {
      fromBlock: '0x99A8E9',
      toBlock: 'latest',
      contractAddresses,
      maxCount: '0x15',
      excludeZeroValue: true,
      category: ['erc20'],
    },
  ]

  if (fromAddress !== null) {
    params[0].fromAddress = fromAddress
  }

  if (toAddress !== null) {
    params[0].toAddress = toAddress
  }

  const body = {
    jsonrpc: '2.0',
    id: 0,
    method: 'alchemy_getAssetTransfers',
    params,
  }

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }

  const resp = await fetch(alchemyApiUrl, requestOptions)
  const data = await resp.json()
  return data['result']['transfers']
}

export const getTransactionHistory = async (address: string) => {
  const fromTransactions = await fetchTransactionHistory(address, null)
  const toTransactions = await fetchTransactionHistory(null, address)
  return [...fromTransactions, ...toTransactions]
}
