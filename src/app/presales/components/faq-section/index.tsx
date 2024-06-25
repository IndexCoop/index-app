import Link from 'next/link'

import { FaqItem, FaqList } from '@/components/faq'

export function FaqSection() {
  return (
    <FaqList>
      <FaqItem question='Why Presales?'>
        <p>
          The presale process enables users and early adopters to demonstrate
          tangible demand for a proposed product by depositing to the token
          before launch. This enables Index Coop to better allocate resources to
          products that the community wants. Successful presales also help
          bootstrap initial TVL for new products and overcome the “cold start”
          problem that new products face.
        </p>
      </FaqItem>
      <FaqItem question='How do presales work?'>
        <p>
          Each presale will have a pre-defined deposit threshold that must be
          met within a specified time period to determine whether or not the
          product is formally launched. Presale participants deposit to the
          pre-launch product contract in exchange for Product Revenue Token
          (PRT) rewards, which may be staked* to receive a share of future
          product revenue.
        </p>
        <p>
          If a presale meets or exceeds this threshold in the allotted time,
          Index Coop will launch the Product within a specified time period. The
          pre-launch token will be rebalanced into the full product composition
          and PRTs will be made available to presale participants after the
          product has been launched and live for a specified time period.
        </p>
        <p>
          If the presale does not meet the target threshold, the product will
          not be launched and no PRTs will be distributed.
        </p>
        <p>
          <span className='font-bold'>
            Important: Deposits to the contract must be maintained until the end
            of the post-launch period in order to maintain PRT eligibility.
          </span>{' '}
          Presale participants are always free to withdraw their assets, though
          withdrawing before the post-launch officially concludes results in
          forfeiture of PRTs.
          <br />
          <br />
          <Link
            className='underline'
            href='https://indexcoop.com/blog/hyeth-pre-sale-faqs'
            target='_blank'
          >
            Learn more about PRTs
          </Link>
        </p>
      </FaqItem>
      <FaqItem question='How high are my rewards?'>
        <p>
          There is a fixed supply of PRTs for all products with PRTs. The
          presale will show how many PRTs will be distributed in the event of a
          success, meeting the threshold by the deadline. For example, if a
          product has a supply of 10,000 PRTs and 3,000 PRTs are distributed in
          the presale, 30% are allocated for presale depositors.
        </p>
        <p>
          Each presale will have a distribution curve for PRTs, and the
          distribution curve determines your rewards. You can track your amount
          of PRTs earned in the staking widget. Typically, the more you deposit
          and the earlier you deposit, the higher your PRT allocation will be.
          Still, other factors exist, such as the total amount of capital
          deposited during the presale.
        </p>
      </FaqItem>
      <FaqItem question='Will my funds be locked up?'>
        <p>
          No, you may withdraw at any time during and after a presale. However,
          if you withdraw before a presale is completed, you forfeit any accrued
          PRT rewards. Presales may require participants to maintain deposits
          for a specified amount of time to be eligible for PRT staking also.
        </p>
        <p>
          If a presale is successful, your original deposit will be transformed
          into the ultimate product token, so no action will be required. At
          that point, the product token will be tradeable via the Index Coop
          app.
        </p>
      </FaqItem>
    </FaqList>
  )
}
