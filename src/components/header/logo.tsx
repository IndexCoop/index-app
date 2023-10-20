import Image from 'next/image'

import { useICColorMode } from '@/lib/styles/colors'
import { IndexLogoBlack, IndexLogoWhite } from '@/lib/utils/assets'

export const Logo = () => {
  const { isDarkMode } = useICColorMode()
  const logo = isDarkMode ? IndexLogoWhite : IndexLogoBlack
  return <Image alt='Index Coop Logo' src={logo} height={32} width={32} />
}
