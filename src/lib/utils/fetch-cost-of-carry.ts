import { ChainId, UiPoolDataProvider } from '@aave/contract-helpers'
import { formatReserves } from '@aave/math-utils'
import { AaveV3Arbitrum } from '@bgd-labs/aave-address-book'
import { providers } from 'ethers'
import { Dispatch, SetStateAction } from 'react'
import { Address, PublicClient, formatUnits } from 'viem'

import { ARBITRUM } from '@/constants/chains'
import { FlashMintLeveragedExtendedAddress } from '@/constants/contracts'
import { Token } from '@/constants/tokens'

import { FlashMintLeveragedExtendedAbi } from './abi/interfaces'
import { NavProvider } from './api/nav'

export async function fetchCostOfCarry(
  publicClient: PublicClient,
  jsonRpcProvider: providers.JsonRpcProvider,
  inputOutputToken: Token,
  inputTokenAmount: bigint,
  isMinting: boolean,
  setCostOfCarry: Dispatch<SetStateAction<number | null>>,
) {
  if (inputTokenAmount === BigInt(0)) return

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

    const { collateralAmount, debtAmount } = await publicClient.readContract({
      address: FlashMintLeveragedExtendedAddress,
      abi: FlashMintLeveragedExtendedAbi,
      functionName: 'getLeveragedTokenData',
      args: [
        inputOutputToken.arbitrumAddress as Address,
        inputTokenAmount,
        isMinting,
      ],
    })

    const navProvider = new NavProvider()
    const nav = await navProvider.getNavPrice(
      inputOutputToken.symbol,
      ARBITRUM.chainId,
    )

    const supplyAPY = Number(borrowedAsset.supplyAPY)
    const borrowAPY = Number(borrowedAsset.variableBorrowAPY)

    const costOfCarry =
      (Number(formatUnits(collateralAmount, 18)) * supplyAPY -
        Number(formatUnits(debtAmount, 18)) * borrowAPY) /
      nav
    setCostOfCarry(costOfCarry)
  } catch (e) {
    console.error('Caught error while fetching borrow rates', e)
  }
}
