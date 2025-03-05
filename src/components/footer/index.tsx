import { FooterLink } from './footer-link'
import { LogoFull } from './logo-full'

const navigation = {
  resources: [
    {
      name: 'Audits',
      href: 'https://docs.indexcoop.com/index-coop-community-handbook/protocols/security',
    },
    { name: 'Bug Bounty', href: 'https://immunefi.com/bounty/indexcoop/' },
    { name: 'GitHub', href: 'https://github.com/IndexCoop' },
    {
      name: 'Press Kit',
      href: 'https://index-coop.notion.site/Index-Coop-Brand-Resources-16bfd8ba832046948bf747b4dc88f899',
    },
    {
      name: 'Legacy Products',
      href: '/legacy',
      target: '_self',
    },
    {
      name: 'Liquidity Mining (discontinued)',
      href: 'https://archive.indexcoop.com/liquidity-mining',
    },
  ],
  community: [
    { name: 'Twitter', href: 'https://twitter.com/indexcoop' },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/index-coop/' },
    { name: 'Discord', href: 'https://discord.com/invite/indexcoop' },
    { name: 'YouTube', href: 'https://www.youtube.com/@indexcoop' },
  ],
  legal: [
    { name: 'Privacy Policy', href: 'https://indexcoop.com/privacy-policy' },
    {
      name: 'Terms of Service',
      href: 'https://indexcoop.com/terms-of-service',
    },
    {
      name: 'Tokens Restricted for Restricted Persons',
      href: 'https://indexcoop.com/tokens-restricted-for-restricted-persons',
    },
  ],
}

export function Footer() {
  return (
    <footer className='z-50 flex w-full justify-center px-8 py-12 leading-4 backdrop-blur lg:px-12 lg:py-20 dark:bg-black dark:bg-opacity-50'>
      <div className='max-w-7xl'>
        <div className='mb-8 sm:mb-12 lg:mb-16'>
          <div className='lg:grid lg:grid-cols-4 lg:gap-8'>
            <LogoFull />
            <div className='mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:col-span-3 lg:mt-0'>
              <div>
                <h3 className='text-ic-gray-900 dark:text-ic-gray-50 text-sm font-semibold leading-6'>
                  Resources
                </h3>
                <ul className='mt-6 space-y-4'>
                  {navigation.resources.map((item) => (
                    <FooterLink
                      key={item.name}
                      href={item.href}
                      target={item.target}
                    >
                      {item.name}
                    </FooterLink>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className='text-ic-gray-900 dark:text-ic-gray-50 text-sm font-semibold leading-6'>
                  Community
                </h3>
                <ul className='mt-6 space-y-4'>
                  {navigation.community.map((item) => (
                    <FooterLink key={item.name} href={item.href}>
                      {item.name}
                    </FooterLink>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className='text-ic-gray-900 dark:text-ic-gray-50 text-sm font-semibold leading-6'>
                  Legal
                </h3>
                <ul className='mt-6 space-y-4'>
                  {navigation.legal.map((item) => (
                    <FooterLink key={item.name} href={item.href}>
                      {item.name}
                    </FooterLink>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className='text-ic-gray-600 dark:text-ic-gray-300 space-y-4 text-xs font-light'>
          <p>
            Disclaimer: This content is for informational purposes only and is
            not legal, tax, investment, financial, or other advice. You should
            not take, or refrain from taking, any action based on any
            information contained herein, or any other information that we make
            available at any time, including blog posts, data, articles, links
            to third-party content, discord content, news feeds, tutorials,
            tweets, and videos. Before you make any financial, legal, technical,
            or other decisions, you should seek independent professional advice
            from a licensed and qualified individual in the area for which such
            advice would be appropriate. This information is not intended to be
            comprehensive or address all aspects of Index or its products. There
            is additional documentation on Index’s website about the functioning
            of Index Coop, and its ecosystem and community.
          </p>
          <p>
            You shall not purchase or otherwise acquire our restricted tokens if
            you are: a citizen, resident (tax or otherwise), green card holder,
            incorporated in, owned or controlled by a person or entity in,
            located in, or have a registered office or principal place of
            business in the U.S. (a “U.S. Person”), or if you are a person in
            any jurisdiction in which such offer, sale, and/or purchase of any
            of our token products is unlawful, prohibited, or unauthorized
            (together with U.S. Person, a “Restricted Person”). The term
            “Restricted Person” includes, but is not limited to, any natural
            person residing in, or any firm, company, partnership, trust,
            corporation, entity, government, state or agency of a state, or any
            other incorporated or unincorporated body or association,
            association or partnership (whether or not having separate legal
            personality) that is established and/or lawfully existing under the
            laws of, a jurisdiction in which such offer, sale, and/or purchase
            of any of our token products is unlawful, prohibited, or
            unauthorized). You shall not resell or otherwise transfer our
            restricted tokens to any Restricted Person. The transfer or resale
            of our restricted tokens to any Restricted Person is not permitted.
            Click{' '}
            <a
              className='underline'
              href='https://indexcoop.com/tokens-restricted-for-restricted-persons'
            >
              here
            </a>{' '}
            to view the list of Tokens Restricted for Restricted Persons. You
            shall read the{' '}
            <a
              className='underline'
              href='https://indexcoop.com/legal/terms-of-service'
            >
              Terms of Service
            </a>{' '}
            and use our Website in compliance with the Terms of Service.
          </p>
        </div>
      </div>
    </footer>
  )
}
