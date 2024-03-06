import Image from 'next/image'
import { IndexLogoBlack, IndexLogoWhite } from '@/lib/utils/assets'

export const Logo = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <a href='https://indexcoop.com/'>
      <Image
        alt='Index Coop Logo'
        src={isDarkMode ? IndexLogoWhite : IndexLogoBlack}
        height={32}
        width={32}
      />
    </a>
  )
}
