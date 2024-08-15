import Link from 'next/link'

export function Disclaimer() {
  return (
    <p className='text-ic-gray-400 mt-4 text-[10px] font-medium leading-5'>
      *Product-specific PRT staking will be made available in the Index Coop
      app; staking will not be available to Restricted Persons (including US
      Persons) as defined{' '}
      <Link
        className='underline'
        href='https://indexcoop.com/tokens-restricted-for-restricted-persons'
        target='_blank'
      >
        here
      </Link>
      . More information on PRT distribution and staking will be published when
      a successful presale product is formally launched.
    </p>
  )
}
