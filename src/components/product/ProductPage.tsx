import { useEffect, useState } from 'react'

import { Box, Flex, useBreakpointValue } from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'

import QuickTrade from 'components/dashboard/QuickTrade'
import Page from 'components/Page'
import { getPriceChartData } from 'components/product/PriceChartData'
import { IndexToken, Token } from 'constants/tokens'
import {
  TokenMarketDataValues,
  useMarketData,
} from 'providers/MarketData/MarketDataProvider'
import { SetComponent } from 'providers/SetComponents/SetComponentsProvider'
import { displayFromWei } from 'utils'
import {
  getFormattedChartPriceChanges,
  getPricesChanges,
} from 'utils/priceChange'
import { getTokenSupply } from 'utils/setjsApi'

import MarketChart, { PriceChartRangeOption } from './MarketChart'
import ProductComponentsTable from './ProductComponentsTable'
import ProductHeader from './ProductHeader'
import ProductPageSectionHeader from './ProductPageSectionHeader'
import ProductStats, { ProductStat } from './ProductStats'

function getStatsForToken(
  tokenData: Token,
  marketData: TokenMarketDataValues,
  currentSupply: number
): ProductStat[] {
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

  return [
    { title: 'Market Cap', value: marketCapFormatted },
    { title: 'Volume', value: volumeFormatted },
    { title: 'Current Supply', value: supplyFormatted },
    { title: 'Streaming Fee', value: tokenData.fees?.streamingFee ?? 'n/a' },
    { title: 'Mint Fee', value: tokenData.fees?.mintFee ?? 'n/a' },
    { title: 'Redeem Fee', value: tokenData.fees?.redeemFee ?? 'n/a' },
  ]
}

const ProductPage = (props: {
  tokenData: Token
  marketData: TokenMarketDataValues
  components: SetComponent[]
  isLeveragedToken?: boolean
  apy?: string
}) => {
  const isMobile = useBreakpointValue({ base: true, lg: false })
  const { marketData, tokenData } = props

  const { chainId, library } = useEthers()
  const { selectLatestMarketData } = useMarketData()

  const [currentTokenSupply, setCurrentTokenSupply] = useState(0)

  useEffect(() => {
    const tokenAddress = tokenData.address

    if (
      tokenAddress === undefined ||
      library === undefined ||
      chainId === undefined
    ) {
      return
    }

    const fetchSupply = async () => {
      try {
        const setDetails = await getTokenSupply(
          library,
          [tokenAddress],
          chainId
        )
        if (setDetails.length < 1) return
        const supply = parseFloat(
          displayFromWei(setDetails[0].totalSupply) ?? '0'
        )
        setCurrentTokenSupply(supply)
      } catch (error) {
        console.log(error)
      }
    }

    fetchSupply()
  }, [chainId, library, tokenData])

  const priceChartData = getPriceChartData([marketData])

  const price = selectLatestMarketData(marketData.hourlyPrices).toLocaleString(
    'en-US',
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  )
  const priceFormatted = `$${price}`
  const priceChanges = getPricesChanges(marketData.hourlyPrices ?? [])
  const priceChangesFormatted = getFormattedChartPriceChanges(priceChanges)

  const stats = getStatsForToken(tokenData, marketData, currentTokenSupply)

  const chartWidth = window.outerWidth < 400 ? window.outerWidth : 648
  const chartHeight = window.outerWidth < 400 ? 300 : 400

  return (
    <Page>
      <Flex direction='column' w={['100%', '80vw']} m='0 auto'>
        <Box mb={['16px', '48px']}>
          <ProductHeader
            isMobile={isMobile ?? false}
            tokenData={props.tokenData}
          />
        </Box>
        <Flex direction='column' zIndex='-1'>
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
              <QuickTrade isNarrowVersion={true} singleToken={tokenData} />
            </Flex>
          </Flex>
          <ProductPageSectionHeader title='Stats' topMargin='120px' />
          <ProductStats stats={stats} />
          {props.tokenData.symbol !== IndexToken.symbol && (
            <>
              <ProductPageSectionHeader title='Allocations' />
              <ProductComponentsTable
                components={props.components}
                tokenData={props.tokenData}
                isLeveragedToken={props.isLeveragedToken}
              />
            </>
          )}
        </Flex>
      </Flex>
    </Page>
  )
}

export default ProductPage
