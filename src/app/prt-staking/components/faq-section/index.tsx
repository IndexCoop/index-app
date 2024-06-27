import { FaqItem, FaqList } from '@/components/faq'

export function FaqSection() {
  return (
    <FaqList>
      <FaqItem question='What are PRTs?'>
        <p>
          The pre-sale process enables customers and early adopters to
          demonstrate tangible demand for a proposed product by depositing funds
          into the token before launch. This way, Index Coop will allocate
          development resources only to products that quantifiably serve a need
          for enough customers while supporting early adopters. Additionally,
          the presales will bootstrap initial TVL and liquidity for our new
          products, giving them a better chance at being adopted by the market.
        </p>
      </FaqItem>
      <FaqItem question='How does PRT Staking work?'>
        <p>
          Each pre-sale will have a pre-defined deposit threshold that must be
          met within a specified amount of time to determine whether or not the
          product is formally launched. If the presale threshold is met the
          token will be formally launched and depositors will get product
          revenue tokens via an airdrop. PRTs distribute an Index products’
          revenue amongst all PRT holders by staking PRTs in the respective IC
          product revenue pool.* If the presale threshold is not met within the
          timeframe, your deposits will be returned alongside an $INDEX reward.
        </p>
      </FaqItem>
      <FaqItem question='How high are my rewards?'>
        <p>
          Depending on wether the deposit threshold has been met, you will
          either receive product revenue tokens or $INDEX rewards. The $INDEX
          rewards are specified in each presale on the list above. The amount of
          PRTs distributed will be set per day and PRT rewards will be
          calculated on a pro rate basis amongst all depositors. The amount of
          PRT tokens given out for each pre-sale can vary by product. For each
          product there will be a total of 10,000 PRTs which will share the
          respective token’s revenue.
        </p>
      </FaqItem>
      <FaqItem question='Am I eligible to stake?'>
        <p>
          No. You can withdraw your deposit at any time. If you choose to keep
          your funds deposited after a successful pre-sale is completed, they
          will automatically convert into the new token, which will be tradable
          via our app.
        </p>
      </FaqItem>
    </FaqList>
  )
}
