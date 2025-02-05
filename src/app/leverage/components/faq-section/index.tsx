import Image from 'next/image'

import { FaqItem, FaqList } from '@/components/faq'

export function FaqSection() {
  return (
    <FaqList className='mx-auto my-12 w-full !max-w-7xl px-4 sm:px-6 md:mx-8'>
      <FaqItem
        question='How does the Leverage Suite work?'
        id='faq-leverage-interface'
      >
        <p>
          The Leverage Suite automates your leveraged trading through DeFi
          lending platforms like Aave V3—no perps, no margin calls, and no
          hidden fees. Each token is fully collateralized, with built-in
          liquidation protection and transparent costs, so you can enjoy
          leverage without worrying about managing constant rebalances or
          liquidation risk.
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
      <FaqItem
        question='How do leverage tokens work vs perps?'
        id='faq-tokens-work'
      >
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
      <FaqItem question='Is there liquidation risk?' id='faq-liquidation-risk'>
        <p>
          Every token in the Leverage Suite automatically rebalances the
          underlying collateralized debt positions on Aave v3 to avoid
          liquidation during volatile periods. Redundant keeper systems monitor
          the current leverage ratio for each token at all times and trigger a
          rebalance if it exceeds the maximum leverage ratio.
        </p>
        <p>
          Another layer of protection is enabled by the ripcord system, which
          allows anyone to trigger a rebalance if the current leverage ratio
          exceeds a predefined ripcord leverage ratio; there is also a 0.25 ETH
          reward for anyone who triggers a ripcord rebalance.
        </p>
      </FaqItem>
      <FaqItem
        question='How long should I hold leverage tokens?'
        id='how-long-should-i-hold-leverage-tokens'
      >
        <p>
          There is no specific amount of time users should or should not hold
          our leverage tokens. However, typically speaking, leverage products
          are not designed for long term holding. You can gain a basic
          understanding of the factors impacting some leverage token performance
          from our{' '}
          <a
            href='https://indexcoop.com/blog/how-eth2x-performs-in-different-market-conditions'
            target='_blank'
            className='underline'
          >
            article on how ETH2x performs in different market conditions
          </a>
          .
        </p>
        <p>
          The main factors that will impact leverage token performance include,
          tracking error, volatility drift, rebalancing overheads as well as
          costs and fees compounding over time.
        </p>
        <p>
          Users should frequently monitor their token holdings and take time to
          fully understand how the products work and are expected to behave in
          different market environments.
        </p>
      </FaqItem>
      <FaqItem
        question='I’m having trouble buying or selling my tokens. What can I do?'
        id='faq-trouble-trading-leverage-tokens'
      >
        <p>
          If you are having difficulty trading your leverage tokens via the
          Index Coop app, double check the following:
        </p>
        <ul className='list-disc pl-6'>
          <li>
            If you are attempting to sell a leverage token on Arbitrum or Base,
            ensure that you are connected to the correct network.
          </li>
          <li>
            Are you a restricted person? Keep in mind that restricted persons
            are not permitted to buy or sell Index Coop restricted tokens for
            restricted persons.
          </li>
          <li>
            Have you signed the terms and conditions? Submitting transactions
            will not be possible if you have not signed the terms and
            conditions.
          </li>
          <li>Has the token you’re trying to mint reached its supply cap?</li>
        </ul>
        <p>
          If you are unable to troubleshoot your transaction, you can open a
          chat via the support widget in the bottom right corner of the
          interface to receive more support from our team.
        </p>
      </FaqItem>
      <FaqItem
        question='What are the costs and fees for Index Coop leverage tokens?'
        id='faq-costs-fees'
      >
        <div className='my-4'>
          <Image
            src='/assets/leverage-suite-fees.png'
            width={500}
            height={500}
            alt='Leverage Suite Fees'
          />
        </div>
        <p>
          The Leverage Suite offers a significant cost advantage over{' '}
          <a
            href='https://dune.com/index_coop/indexcoop-perps-vs-leverage-tokens'
            target='_blank'
            className='underline'
          >
            perps and CEXs on fees
          </a>
          , often being{' '}
          <a
            href='https://thedefiant.io/education/tokens/stop-throwing-away-your-gains-index-coop-leverage-tokens-can-be-5x-cheaper-than-perps'
            target='_blank'
            className='underline'
          >
            5-6x more cost-effective than comparable alternatives
          </a>
          . However, it is important to understand where costs and fees arise
          within a given strategy, and there are a few different types to be
          aware of.
        </p>
        <ul className='list-disc space-y-6 pl-6'>
          <li>
            <span className='font-bold'>Index Coop fees:</span> These are fixed
            fees charged by Index Coop based on the type of product.
            <ul className='list-disc pl-6'>
              <li>1x and 2x products incur an annual fee of 3.65%.</li>
              <li>3x products incur an annual fee of 5.48%.</li>
              <li>
                All products are subject to issuance and redemption fees of
                0.10%.
              </li>
            </ul>
          </li>
          <li>
            <span className='font-bold'>Cost of carry:</span> This is a dynamic
            cost incurred from borrowing on a lending market.
            <p className='mt-2'>
              The underlying mechanism of the Leverage suite tokens uses DeFi
              lending platform deposits and borrows. Assets deposited accrue
              interest from borrows, while borrowed assets incur interest
              expenses. The difference between these rates is your “cost of
              carry,” which can vary over time—sometimes favorably (if earned
              interest exceeds borrowing costs) and sometimes unfavorably (if
              borrowing costs outpace earned interest), as the underlying
              lending platform&apos;s borrow and earn rates vary.
            </p>
            <p className='mt-2'>
              For example, if ETH2x deposits $1,000 of WETH and borrows $500 of
              USDC, where ETH deposits earn +2% and borrowing USDC costs -5%,
              the resulting net Cost of Carry is -1%.
            </p>
          </li>
          <li>
            <span className='font-bold'>Rebalancing costs:</span> This is a cost
            incurred when swapping borrowed assets to create leverage.
            <p className='mt-2'>
              While Index Coop doesn&pos;t impose charges, swapping assets
              through DEX pools incurs small fees paid to liquidity providers,
              such as the 0.05% swap fee in Uni v3 WETH/USDC pools. Moreover,
              swaps also entail &quot;price impact,&quot; wherein larger swaps
              lead to higher overall prices paid for buys or lower overall
              prices received for sells, thus gradually reducing the net value
              of the position over time.
            </p>
          </li>
        </ul>
        <p>
          Index Coop pays for all gas costs associated with each strategy and
          these costs are not passed along to the user. No front-end fees are
          charged for trading using the Leverage Interface.
        </p>
      </FaqItem>
      <FaqItem question='What is volatility drift?' id='faq-volatility-drift'>
        Volatility drift (sometimes called &quot;volatility decay&quot;) is the
        compounding effect on leveraged products that causes their returns to
        deviate from the underlying asset&apos;s performance—beyond what a
        simple multiplication by the leverage factor would suggest. In the
        context of our tokens, periodic adjustments to maintain the respective
        token&apos;s target leverage ratio can magnify price swings, leading to
        drift. For a deeper look, check out our{' '}
        <a
          target='_blank'
          href='https://indexcoop.com/blog/fli-volatility-drift'
          className='underline'
        >
          deep dive on volatility drift
        </a>
        .
      </FaqItem>
      <FaqItem
        question='Why do I see a “Not available for Restricted Persons” message?'
        id='restricted-persons'
      >
        <p>
          The Leverage Suite is unavailable to Restricted Persons as defined in
          our{' '}
          <a
            href='https://indexcoop.com/tokens-restricted-for-restricted-persons'
            target='_blank'
            className='underline'
          >
            Tokens Restricted for Restricted persons
          </a>{' '}
          page.
        </p>
        <p>
          You shall not purchase or otherwise acquire our restricted token
          products if you are: a citizen, resident (tax or otherwise), and/or
          green card holder, incorporated in, owned or controlled by a person or
          entity in, located in, or have a registered office or principal place
          of business in the U.S. (defined as a U.S. person), or if you are a
          person in any jurisdiction in which such offer, sale, and/or purchase
          of any of our token products is unlawful, prohibited, or unauthorised
          (together with U.S. persons, a “Restricted Person”).
        </p>
      </FaqItem>
    </FaqList>
  )
}
