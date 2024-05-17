import { ChainId, UiPoolDataProvider } from '@aave/contract-helpers'
import { formatReserves } from '@aave/math-utils'
import { AaveV3Arbitrum } from '@bgd-labs/aave-address-book'
import { providers } from 'ethers'
import { Dispatch, SetStateAction } from 'react'

import { Token } from '@/constants/tokens'

export async function fetchCostOfCarry(
  jsonRpcProvider: providers.JsonRpcProvider,
  inputOutputToken: Token,
  setCostOfCarry: Dispatch<SetStateAction<number | null>>,
) {
  try {
    const poolDataProviderContract = new UiPoolDataProvider({
      uiPoolDataProviderAddress: AaveV3Arbitrum.UI_POOL_DATA_PROVIDER,
      provider: jsonRpcProvider,
      chainId: ChainId.arbitrum_one,
    })
    const reserves = await poolDataProviderContract.getReservesHumanized({
      lendingPoolAddressProvider: AaveV3Arbitrum.POOL_ADDRESSES_PROVIDER,
    })

    const formattedPoolReserves = formatReserves({
      reserves: reserves.reservesData,
      currentTimestamp: Math.floor(Date.now() / 1000),
      marketReferenceCurrencyDecimals:
        reserves.baseCurrencyData.marketReferenceCurrencyDecimals,
      marketReferencePriceInUsd:
        reserves.baseCurrencyData.marketReferenceCurrencyPriceInUsd,
    })

    const borrowedAsset = formattedPoolReserves.find(
      (asset) =>
        asset.symbol.toLowerCase() ===
        inputOutputToken.borrowedAssetSymbol?.toLowerCase(),
    )

    if (!borrowedAsset) {
      return
    }

    setCostOfCarry(
      Number(borrowedAsset.supplyAPY) - Number(borrowedAsset.variableBorrowAPY),
    )
  } catch (e) {
    console.error('Caught error while fetching borrow rates', e)
  }
}
