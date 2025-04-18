import { FaqItem, FaqList } from '@/components/faq'

export function FaqSection() {
  return (
    <FaqList className='mx-auto my-12 w-full !max-w-7xl px-4 sm:px-6 md:mx-8'>
      <FaqItem question='Why should I use Index Coop yield tokens?'>
        <p>
          Index Coop yield tokens offer a range of benefits that make them an
          attractive choice for users across the DeFi spectrum.
        </p>
        <ul className='list-disc pl-6'>
          <li>
            Automatic rebalances: Benefit from regular, hands-off rebalances
            that keep yields competitive without the need to monitor the market.
          </li>
          <li>
            Diversified exposure: Hold a basket earning an aggregate yield in
            battle-tested DeFi protocols, reducing risk through diversification.
          </li>
          <li>
            Simplified accounting: Enjoy behind-the-scenes rebalances,
            eliminating the need for users to make and track multiple
            transactions.
          </li>
          <li>
            Security and transparency: Index Coop has made considerable efforts
            to ensure that Index Protocol, the foundation of our yield tokens,
            is secure and reliable. Our protocol has been thoroughly reviewed by
            top independent security firms, and every line of code is heavily
            scrutinized. See our{' '}
            <a
              href='https://docs.indexcoop.com/index-coop-community-handbook/protocol/security-and-audits'
              target='_blank'
              className='underline'
            >
              audit history and Bug Bounty Program
            </a>{' '}
            for more details.
          </li>
        </ul>
      </FaqItem>
      <FaqItem question='How does each product determine which protocols are included?'>
        <p>
          Each Index Coop product follows a specific product methodology that
          determines the underlying assets and strategies included in the
          product. This methodology outlines the criteria and processes used to
          select protocols, ensuring that each product aligns with its unique
          objectives.
        </p>
        <ul className='list-disc pl-6'>
          <li>
            Selection Criteria May Include:
            <ul className='list-disc pl-6'>
              <li>
                Market Capitalization: Only protocols with a certain level of
                market value are included to ensure liquidity and stability.
              </li>
              <li>
                Liquidity: Protocols must have sufficient trading volume and
                availability on exchanges.
              </li>
              <li>
                Security Standards: Inclusion of protocols that have undergone
                thorough security audits to mitigate risks.
              </li>
              <li>
                Innovation and Adoption: Preference for protocols that
                demonstrate strong innovation, user adoption, and community
                support.
              </li>
            </ul>
          </li>
          <li>
            Learn more about each product’s methodology here:
            <ul className='list-disc pl-6'>
              <li>
                <a
                  href='https://indexcoop.com/products/high-yield-eth'
                  target='_blank'
                  className='underline'
                >
                  hyETH
                </a>
              </li>
              <li>
                <a
                  href='https://indexcoop.com/products/interest-compounding-eth-index'
                  target='_blank'
                  className='underline'
                >
                  icETH
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </FaqItem>
      <FaqItem question='Are Index Coop yield products rebasing tokens or repricing tokens?'>
        <p>
          All Index Coop yield tokens are repricing tokens, meaning they adjust
          in price to reflect changes in value or yield without altering the
          total supply of tokens.
        </p>
        <p>
          Unlike rebasing tokens, which change the token supply and can affect
          wallet balances, repricing tokens maintain a constant supply. This
          design simplifies portfolio management and accounting for users.
        </p>
        <p>
          The token price directly reflects the accumulated yield or
          performance, providing a straightforward and transparent understanding
          of the token&apos;s value.
        </p>
      </FaqItem>
      <FaqItem question='What are the fees?'>
        <p>
          Index Coop charges annual fees on yield tokens, which vary depending
          on the product. There are no issuance or redemption fees for yield
          tokens.
        </p>
        <p>Fees by Product:</p>
        <ul className='list-disc pl-6'>
          <li>
            hyETH
            <ul className='list-disc pl-6'>
              <li>Annual Fee: 0.95%</li>
            </ul>
          </li>
          <li>
            icUSD
            <ul className='list-disc pl-6'>
              <li>
                Performance-based Fee: 10% of the 30-day organic yield
                (dynamically calculated)
              </li>
            </ul>
          </li>
          <li>
            icETH
            <ul className='list-disc pl-6'>
              <li>Annual Fee: 0.75%</li>
            </ul>
          </li>
        </ul>
      </FaqItem>
      <FaqItem question='Where can I find more details for a product?'>
        <p>
          Index Coop strives to provide as much clarity around our products as
          possible. Here are relevant links to product information for users
          looking to dive deeper.
        </p>
        <ul className='list-disc pl-6'>
          <li>
            hyETH
            <ul className='list-disc pl-6'>
              <li>
                <a
                  href='https://dune.com/index_coop/hyeth'
                  target='_blank'
                  className='underline'
                >
                  Dune Dashboards
                </a>{' '}
                for more detailed product data and analytics
              </li>
              <li>
                <a
                  href='https://dune.com/index_coop/hyeth'
                  target='_blank'
                  className='underline'
                >
                  Gitbook
                </a>{' '}
                for product documentation
              </li>
              <li>
                Article |{' '}
                <a
                  href='https://indexcoop.com/blog/introducing-high-yield-eth-index'
                  target='_blank'
                  className='underline'
                >
                  Introducing hyETH
                </a>
              </li>
              <li>
                <a
                  href='https://indexcoop.com/product-faqs/hyeth-faq'
                  target='_blank'
                  className='underline'
                >
                  hyETH FAQs
                </a>{' '}
                for more information
              </li>
            </ul>
          </li>
          <li>
            icUSD
            <ul className='list-disc pl-6'>
              <li>
                <a
                  href='https://indexcoop.com/blog/2024-roadmap-update'
                  target='_blank'
                  className='underline'
                >
                  Roadmap Update
                </a>{' '}
                | Integrating icUSD
              </li>
            </ul>
          </li>
          <li>
            icETH
            <ul className='list-disc pl-6'>
              <li>
                <a
                  href='https://dune.com/index_coop/icETH'
                  target='_blank'
                  className='underline'
                >
                  Dune Dashboards
                </a>{' '}
                for more detailed product data and analytics
              </li>
              <li>
                <a
                  href='https://docs.indexcoop.com/index-coop-community-handbook/products/yield/interest-compounding-eth-index-iceth'
                  target='_blank'
                  className='underline'
                >
                  Gitbook
                </a>{' '}
                for product documentation
              </li>
              <li>
                Article |{' '}
                <a
                  href='https://indexcoop.com/blog/introducing-the-interest-compounding-eth-index'
                  target='_blank'
                  className='underline'
                >
                  Introducing icETH
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </FaqItem>
      <FaqItem question='I have an issue. What can I do?'>
        <p>
          If you are having difficulty swapping your tokens via the Index Coop
          app, double check the following:
        </p>
        <ul className='list-disc pl-6'>
          <li>
            Are you a{' '}
            <a
              href='https://indexcoop.com/tokens-restricted-for-restricted-persons'
              target='_blank'
              className='underline'
            >
              restricted person?
            </a>{' '}
            Keep in mind that restricted persons are not permitted to buy or
            sell Index Coop tokens that are restricted in their region.
          </li>
          <li>
            Have you signed the terms and conditions? Submitting transactions
            will not be possible if you have not signed the terms and
            conditions.
          </li>
          <li>
            Are you connected to the correct network and do you have enough ETH
            in your wallet to pay for gas?
          </li>
        </ul>
        <p>
          If you are unable to troubleshoot your transaction, you can open a
          chat via the support widget in the bottom right corner of the
          interface to receive more support from our team. Alternatively, reach
          out to the team in the{' '}
          <a
            href='https://discord.com/invite/indexcoop'
            target='_blank'
            className='underline'
          >
            Index Coop Discord.
          </a>
        </p>
      </FaqItem>
    </FaqList>
  )
}
