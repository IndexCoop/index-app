import Image from 'next/image'

export function LogoFull({ isDarkMode }: { isDarkMode: boolean }) {
  const logoPath = isDarkMode
    ? '/assets/index-logo-full-white.svg'
    : '/logo-full.svg'
  return <Image src={logoPath} alt='Index Coop Logo' height={29} width={130} />
}
