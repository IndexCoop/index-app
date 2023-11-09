import { shouldShowWarningSign } from '@/components/trade/_shared/QuickTradeFormatter'
import { ZeroExQuote } from '@/lib/hooks/useBestQuote'
import { displayFromWei } from '@/lib/utils'
import { getBlockExplorerContractUrl } from '@/lib/utils/blockExplorer'
import { getZeroExRouterAddress } from '@/lib/utils/contracts'
import { getNativeToken } from '@/lib/utils/tokens'

import { TradeInfoItem } from '../../components/trade-details/trade-info'

const formatIfNumber = (value: string) => {
  if (/[a-z]/i.test(value)) return value

  return Number(value).toLocaleString('en', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })
}

export function buildTradeDetails(
  quote0x: ZeroExQuote | null,
  slippage: number
): TradeInfoItem[] {
  if (quote0x === null) return []
  const chainId = Number(quote0x.chainId)

  const minReceive = displayFromWei(quote0x.minOutput, 4) ?? '0.0'
  const minReceiveFormatted =
    formatIfNumber(minReceive) + ' ' + quote0x.outputToken.symbol

  const networkFee = displayFromWei(quote0x.gasCosts)
  const networkFeeDisplay = networkFee ? parseFloat(networkFee).toFixed(4) : '-'
  const networkToken = getNativeToken(chainId)?.symbol ?? ''

  const offeredFromSources = quote0x.sources
    .filter((source) => Number(source.proportion) > 0)
    .map((source) => source.name)

  const slippageFormatted = `${slippage}%`
  const slippageTitle = shouldShowWarningSign(slippage)
    ? `Slippage ⚠`
    : `Slippage`

  const contractBestOption = getZeroExRouterAddress(chainId)
  const contractBlockExplorerUrl = getBlockExplorerContractUrl(
    contractBestOption,
    chainId
  )

  return [
    {
      title: 'Minimum ' + quote0x.outputToken.symbol + ' Received',
      values: [minReceiveFormatted],
    },
    {
      title: 'Network Fee',
      values: [
        `${networkFeeDisplay} ${networkToken} ($${quote0x.gasCostsInUsd.toFixed(
          2
        )})`,
      ],
    },
    {
      title: slippageTitle,
      values: [slippageFormatted],
    },
    {
      isLink: true,
      title: 'Contract',
      values: [contractBestOption, contractBlockExplorerUrl],
    },
    { title: 'Offered From', values: [offeredFromSources.toString()] },
  ]
}
