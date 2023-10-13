import { useICColorMode } from '@/lib/styles/colors'
import { IndexLogoBlack, IndexLogoWhite } from '@/lib/utils/assets'
import Image from 'next/image'

const LogoV2 = () => {
  const { isDarkMode } = useICColorMode()
  const logo = isDarkMode ? IndexLogoWhite : IndexLogoBlack
  return <Image alt='Index Coop Logo' src={logo} height={36} width={36} />
}

export default LogoV2
