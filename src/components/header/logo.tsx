import Image from 'next/image'

import { Link } from '@chakra-ui/react'

import { useICColorMode } from '@/lib/styles/colors'
import { IndexLogoBlack, IndexLogoWhite } from '@/lib/utils/assets'

export const Logo = () => {
  const { isDarkMode } = useICColorMode()
  const logo = isDarkMode ? IndexLogoWhite : IndexLogoBlack
  return (
    <Link
      href='https://indexcoop.com/'
      _hover={{
        textDecoration: 'none',
      }}
      flexGrow={1}
    >
      <Image alt='Index Coop Logo' src={logo} height={32} width={32} />
    </Link>
  )
}
