import Image from 'next/image'
import Link from 'next/link'

import { Path } from '@/constants/paths'
import { IndexLogoBlack, IndexLogoWhite } from '@/lib/utils/assets'

export const Logo = () => {
  return (
    <Link href={Path.LEVERAGE}>
      <Image
        className='block dark:hidden'
        alt='Index Coop Logo'
        src={IndexLogoBlack}
        height={24}
        width={24}
      />
      <Image
        className='hidden dark:block'
        alt='Index Coop Logo'
        src={IndexLogoWhite}
        height={24}
        width={24}
      />
    </Link>
  )
}
