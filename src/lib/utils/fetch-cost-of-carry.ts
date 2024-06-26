import { ChainId, UiPoolDataProvider } from '@aave/contract-helpers'
import { formatReserves } from '@aave/math-utils'
import { AaveV3Arbitrum } from '@bgd-labs/aave-address-book'
import { providers } from 'ethers'
import { Dispatch, SetStateAction } from 'react'
import { Address, PublicClient, formatUnits } from 'viem'

import { leverageCollateralDebt } from '@/app/leverage/constants'
import { ARBITRUM } from '@/constants/chains'
import { Token } from '@/constants/tokens'

import { ArbitrumLeverageTokenAbi } from './abi/interfaces'
import { fetchCoingeckoTokenPrice } from './api/coingecko'
import { NavProvider } from './api/nav'

export async function fetchCostOfCarry(
  publicClient: PublicClient,
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

    const collateralDebtTokens =
      leverageCollateralDebt[inputOutputToken.arbitrumAddress!]

    const collateralAmountPromise = publicClient.readContract({
      address: collateralDebtTokens.collateralAmountToken as Address,
      abi: ArbitrumLeverageTokenAbi,
      functionName: 'balanceOf',
      args: [inputOutputToken.arbitrumAddress as Address],
    })
    const collateralDecimalsPromise = publicClient.readContract({
      address: collateralDebtTokens.collateralAmountToken as Address,
      abi: ArbitrumLeverageTokenAbi,
      functionName: 'decimals',
    })
    const debtAmountPromise = publicClient.readContract({
      address: collateralDebtTokens.debtAmountToken as Address,
      abi: ArbitrumLeverageTokenAbi,
      functionName: 'balanceOf',
      args: [inputOutputToken.arbitrumAddress as Address],
    })
    const debtDecimalsPromise = publicClient.readContract({
      address: collateralDebtTokens.debtAmountToken as Address,
      abi: ArbitrumLeverageTokenAbi,
      functionName: 'decimals',
    })

    const [collateralAmount, collateralDecimals, debtAmount, debtDecimals] =
      await Promise.all([
        collateralAmountPromise,
        collateralDecimalsPromise,
        debtAmountPromise,
        debtDecimalsPromise,
      ])

    const navProvider = new NavProvider()
    const nav = await navProvider.getNavPrice(
      inputOutputToken.symbol,
      ARBITRUM.chainId,
    )

    const collateralPrice = await fetchCoingeckoTokenPrice(
      collateralDebtTokens.collateralPriceToken,
      1,
    )
    const debtPrice = await fetchCoingeckoTokenPrice(
      collateralDebtTokens.debtPriceToken,
      1,
    )

    const supplyAPY = Number(borrowedAsset.supplyAPY)
    const borrowAPY = Number(borrowedAsset.variableBorrowAPY)

    const collateralCalculated =
      Number(formatUnits(collateralAmount, collateralDecimals)) *
      collateralPrice

    const debtCalculated =
      Number(formatUnits(debtAmount, debtDecimals)) * debtPrice

    // TODO: Delete
    console.log({
      symbol: inputOutputToken.symbol,
      collateralAmount,
      collateralCalculated,
      collateralAmountFormatted: Number(
        formatUnits(collateralAmount, collateralDecimals),
      ),
      collateralPrice,
      collateralDecimals,
      debtAmount,
      debtAmountFormatted: Number(formatUnits(debtAmount, debtDecimals)),
      debtCalculated,
      debtDecimals,
      nav,
      supplyAPY,
      borrowAPY,
    })

    const costOfCarry =
      (collateralCalculated * supplyAPY - debtCalculated * borrowAPY) / nav
    setCostOfCarry(costOfCarry)
  } catch (e) {
    console.error('Caught error while fetching borrow rates', e)
  }
}
