import { Box, Flex, useBreakpointValue } from '@chakra-ui/react'

import Page from 'components/page/Page'
import { getPriceChartData } from 'components/token-page/charts/PriceChartData'
import QuickTradeContainer from 'components/trade'
import { IndexToken, Token } from 'constants/tokens'
import { useNetwork } from 'hooks/useNetwork'
import { useTokenComponents } from 'hooks/useTokenComponents'
import { useTokenSupply } from 'hooks/useTokenSupply'
import { TokenMarketDataValues, useMarketData } from 'providers/MarketData'
import { displayFromWei } from 'utils'
import {
  getFormattedChartPriceChanges,
  getPricesChanges,
} from 'utils/priceChange'
import { getAddressForToken, isPerpToken } from 'utils/tokens'

import Disclaimer from './Disclaimer'
import MarketChart, { PriceChartRangeOption } from './MarketChart'
import TokenComponentsTable from './TokenComponentsTable'
import TokenPageHeader from './TokenPageHeader'
import TokenPageSectionHeader from './TokenPageSectionHeader'
import TokenStats, { TokenStat } from './TokenStats'

function getStatsForToken(
  token: Token,
  marketData: TokenMarketDataValues,
  currentSupply: number,
  nav: number
): TokenStat[] {
  const dailyPriceRange = PriceChartRangeOption.DAILY_PRICE_RANGE
  const hourlyDataInterval = 24

  let formatter = Intl.NumberFormat('en', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
    notation: 'compact',
  })

  let supplyFormatter = Intl.NumberFormat('en', { maximumFractionDigits: 2 })

  const marketCap =
    marketData.marketcaps
      ?.slice(-dailyPriceRange * hourlyDataInterval)
      ?.slice(-1)[0]
      ?.slice(-1)[0] ?? 0
  const marketCapFormatted = formatter.format(marketCap)

  const supplyFormatted = supplyFormatter.format(currentSupply)

  const volume =
    marketData.volumes
      ?.slice(-dailyPriceRange * hourlyDataInterval)
      ?.slice(-1)[0]
      ?.slice(-1)[0] ?? 0
  const volumeFormatted = formatter.format(volume)

  let stats = [
    { title: 'Market Cap', value: marketCapFormatted },
    { title: 'Volume (24h)', value: volumeFormatted },
    { title: 'Current Supply', value: supplyFormatted },
  ]
  if (token.symbol !== IndexToken.symbol) {
    stats.push(
      { title: 'Streaming Fee', value: token.fees?.streamingFee ?? 'n/a' },
      { title: 'Mint Fee', value: token.fees?.mintFee ?? 'n/a' },
      { title: 'Redeem Fee', value: token.fees?.redeemFee ?? 'n/a' },
      { title: 'NAV', value: formatter.format(nav) }
    )
  }

  return stats
}

const TokenPage = (props: {
  token: Token
  marketData: TokenMarketDataValues
  isLeveragedToken?: boolean
  apy?: string
}) => {
  const isMobile = useBreakpointValue({ base: true, lg: false })
  const { marketData, token } = props

  const { chainId: networkChainId } = useNetwork()
  const chainId = token.defaultChain ?? networkChainId
  const { selectLatestMarketData } = useMarketData()

  const tokenAddress = getAddressForToken(token, chainId) ?? ''
  const tokenSupply = useTokenSupply(tokenAddress, chainId ?? 1)
  const currentSupplyFormatted = parseFloat(displayFromWei(tokenSupply) ?? '0')

  const priceChartData = getPriceChartData([marketData])

  const price = selectLatestMarketData(marketData.hourlyPrices).toLocaleString(
    'en-US',
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  )
  const priceFormatted = `$${price}`
  const priceChanges = getPricesChanges(marketData.hourlyPrices ?? [])
  const priceChangesFormatted = getFormattedChartPriceChanges(priceChanges)

  const chartWidth = window.outerWidth < 400 ? window.outerWidth : 648
  const chartHeight = window.outerWidth < 400 ? 300 : 400

  const { components, vAssets, nav } = useTokenComponents(
    props.token,
    isPerpToken(props.token)
  )

  const stats = getStatsForToken(token, marketData, currentSupplyFormatted, nav)

  return (
    <Page>
      <Flex direction='column' w={['100%', '80vw']} m='0 auto'>
        <Box mb={['16px', '48px']}>
          <TokenPageHeader isMobile={isMobile ?? false} token={props.token} />
        </Box>
        <Flex direction='column' position='relative' zIndex='1'>
          <Flex direction={['column', 'column', 'column', 'row']}>
            <MarketChart
              marketData={priceChartData}
              prices={[priceFormatted]}
              priceChanges={priceChangesFormatted}
              options={{
                width: chartWidth,
                height: chartHeight,
                hideYAxis: false,
              }}
              apy={props.apy}
            />
            <Flex
              mt={['48px', '48px', '48px', '0']}
              ml={['0', '0', '0', '36px']}
              justifyContent={['center', 'center', 'center', 'flex-start']}
            >
              <QuickTradeContainer isNarrowVersion={true} singleToken={token} />
            </Flex>
          </Flex>
          <TokenPageSectionHeader title='Stats' topMargin='120px' />
          <TokenStats stats={stats} />
          {props.token.symbol !== IndexToken.symbol && (
            <>
              <TokenPageSectionHeader title='Allocations' />
              <TokenComponentsTable
                components={components}
                token={props.token}
                isLeveragedToken={props.isLeveragedToken}
                vAssets={vAssets}
              />
            </>
          )}
        </Flex>
        {props.token.symbol !== IndexToken.symbol && <Disclaimer />}
      </Flex>
    </Page>
  )
}

export default TokenPage
