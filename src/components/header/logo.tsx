import Image from 'next/image'
import { IndexLogoBlack } from '@/lib/utils/assets'

export const Logo = () => {
  return (
    <a href='https://indexcoop.com/'>
      <Image
        alt='Index Coop Logo'
        src={IndexLogoBlack}
        height={32}
        width={32}
      />
    </a>
  )
}
