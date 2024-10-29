import { FaqItem, FaqList } from '@/components/faq'

export function FaqSection() {
  return (
    <FaqList className='mx-auto my-12 w-full !max-w-7xl px-4 sm:px-6 md:mx-8'>
      <FaqItem question='How does the Leverage interface work?'>
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
      <FaqItem question='Is there liquidation risk?'>
        <p>
          Every token in the Index Coop Leverage Suite automatically rebalances
          the underlying collateralized debt positions on Aave v3 to avoid
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
      <FaqItem question='How do I buy leverage tokens?'>
        <p>
          Start by selecting a market via the dropdown in the quickstats widget
          or in the trade widget, then select your desired Leverage amount using
          the Leverage buttons. Now select your input token from the ‘you pay’
          dropdown menu. You will have to connect your wallet and sign our terms
          and conditions before your first action. Make sure you are connected
          to the correct chain and that you have sufficient funds in your
          wallet. Now you can input the desired amount of tokens to trade and
          click ‘Review Transaction’ which will open a transaction review popup.
          Click “Submit Transaction”. This will run a transaction simulation and
          in case of a successful simulation send it to your wallet. Use your
          wallet to sign the transaction. If you want to see your new balance,
          click “Sell” in the transaction window and your balance will show
          under the input asset dropdown.
        </p>
      </FaqItem>
      <FaqItem question='How do I sell leverage tokens?'>
        <p>
          You can sell your leverage tokens by first selecting ETH or BTC,
          selecting “Sell” at the top of the trade widget, and then selecting
          the corresponding leverage ratio of your current token holdings. You
          should see your total balance and be able to input the amount of
          tokens you want to sell.
        </p>
      </FaqItem>
      <FaqItem question='How long should I hold leverage tokens?'>
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
      <FaqItem question='I’m having trouble buying or selling my tokens. What can I do?'>
        <p>
          If you are having difficulty trading your leverage tokens via that
          Index Coop app, double check the following:
        </p>
        <ul className='list-disc pl-6'>
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
      <FaqItem question='What are the costs and fees for Index Coop leverage tokens?'>
        <p>
          Index Coop charges annual fees based on the type of product: 1x and 2x
          products incur a 3.65% fee, while 3x products carry a 5.48% fee.
          Additionally, all products are subject to issuance and redemption fees
          of 0.10%.
        </p>
        <p>
          Costs associated with utilising assets within Aave involve the concept
          of “Cost of Carry,” wherein assets deposited accrue interest from
          borrowers. This results in a spread between the interest earned from
          deposits and the interest paid for the debt. For example, if ETH2x
          deposits $1,000 of WETH and borrows $500 of USDC, where ETH deposits
          earn +2% APY and borrowing USDC costs -5% APY, the resulting net Cost
          of Carry is -1% APY, leading to a slight reduction in the position’s
          value over time. This Cost of Carry may vary, sometimes favourably and
          sometimes unfavourably for users, depending on fluctuating borrowing
          and deposit rates, necessitating regular monitoring via the app.
        </p>
        <p>
          Regarding rebalancing costs, while Index Coop itself doesn’t impose
          charges, swapping assets through DEX pools incur small fees paid to
          liquidity providers, such as the 0.05% swap fee in Uni v3 WETH/USDC
          pools. Moreover, swaps also entail “price impact,” wherein larger
          swaps lead to higher overall prices paid for buys or lower overall
          prices received for sells, thus gradually reducing the net value of
          the position over time.
        </p>
      </FaqItem>
      <FaqItem question='Are there any front-end fees for trading leverage tokens at app.indexcoop.com?'>
        <p>
          No, the Index Coop App does not currently charge any fees. All fees
          are charged at the smart contract level.
        </p>
      </FaqItem>
      <FaqItem question='Is the Leverage Suite available to US Persons?'>
        <p>
          No, Index Coop products are not suitable for any Restricted Persons
          outlined{' '}
          <a
            href='https://indexcoop.com/tokens-restricted-for-restricted-persons'
            target='_blank'
            className='underline'
          >
            here
          </a>
          .
        </p>
      </FaqItem>
      <FaqItem question='Why do I see a “Not available for Restricted Persons” message?'>
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
