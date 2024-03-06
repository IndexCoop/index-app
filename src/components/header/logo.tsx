import Image from 'next/image'
import { IndexLogoBlack, IndexLogoWhite } from '@/lib/utils/assets'

export const Logo = () => {
  return (
    <a href='https://indexcoop.com/'>
      <Image
        className='block dark:hidden'
        alt='Index Coop Logo'
        src={IndexLogoBlack}
        height={32}
        width={32}
      />
      <Image
        className='hidden dark:block'
        alt='Index Coop Logo'
        src={IndexLogoWhite}
        height={32}
        width={32}
      />
    </a>
  )
}
