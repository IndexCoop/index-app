import { FaqItem, FaqList } from '@/components/faq'

export function FaqSection() {
  return (
    <FaqList className='mx-auto my-12 w-full !max-w-7xl px-4 sm:px-6 md:mx-8'>
      <FaqItem question='How does the Yield interface work?'>
        <p>
          The Index Coop Leverage Interface provides streamlined access to
          leverage, featuring built-in liquidation protection and low,
          transparent fees. Built on Index Protocol, our suite of automated
          tokens simplifies leverage trading by utilising Aave V3 to offer users
          six distinct strategies on ETH and BTC. The leverage products users
          trade via the Leverage interface are not perps, but fully
          collateralized tokens.
        </p>
        <p>
          To learn more about The Index Coop Leverage Suite, see our article:{' '}
          <a
            href='https://indexcoop.com/blog/introducing-arbitrum-leverage-suite'
            target='_blank'
            className='underline'
          >
            Introducing The Index Coop Leverage Suite Article
          </a>
          .
        </p>
      </FaqItem>
      <FaqItem question='How do the tokens work?'>
        <p>
          Both leverage tokens and perps offer a way for users to amplify their
          exposure to an asset. However, leverage tokens differ from perps in
          their collateral structure.
        </p>
        <p>
          Perps allow traders to speculate on asset prices without directly
          holding the underlying asset, using collateral (often WETH, WBTC, or
          stablecoins) to open long or short positions with leverage. Traders
          must maintain sufficient margin to avoid liquidation if the market
          moves against them.
        </p>
        <p>
          Leverage tokens are fully collateralized by the underlying asset. For
          example, the ETH3x product supplies WETH to Aave, borrows USDC, and
          swaps it for more WETH. This looping process is repeated until the
          desired leverage is achieved, creating an overcollateralized debt
          position directly tied to the underlying asset’s value.
        </p>
        <p>
          All Index Coop leverage tokens adjust real-time leverage ratios
          through rebalancing within defined bounds. This automated rebalancing
          enables liquidation protection and creates a hands-off experience for
          users.
        </p>
        <p>
          Leverage tokens can also be substantially cheaper than perps because
          the borrow rates on Aave are often significantly lower than the
          typical funding rates on perp platforms.
        </p>
      </FaqItem>
    </FaqList>
  )
}
