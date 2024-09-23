import { FaqItem, FaqList } from '@/components/faq'

export function FaqSection() {
  return (
    <FaqList className='my-16 w-full'>
      <FaqItem question='What happens when I redeem a legacy product?'>
        <p>
          When redeeming a legacy product, a streamlined debt redemption process
          takes place behind the scenes. This ensures that your exit from the
          legacy product is handled in the most cost-effective and efficient
          manner, minimizing any unnecessary steps or fees. Our approach
          guarantees that you maintain full control over your assets while
          seamlessly transitioning out of outdated products.
        </p>
      </FaqItem>
      <FaqItem question='Why legacs tokens?'>
        <p>
          At Index Coop, we support legacy tokens to ensure that early users of
          our products are never left behind. Whether you've held onto old
          products or are looking to upgrade, you can easily and
          cost-efficiently redeem your legacy tokens through our streamlined
          process. We're committed to making this transition smooth and
          accessible, and we appreciate your trust in Index Coop as we continue
          to innovate.
        </p>
      </FaqItem>
    </FaqList>
  )
}
