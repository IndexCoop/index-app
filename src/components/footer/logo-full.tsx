import Image from 'next/image'

export function LogoFull() {
  return (
    <>
      <Image
        className='block dark:hidden'
        src='/logo-full.svg'
        alt='Index Coop Logo'
        height={29}
        width={130}
      />
      <Image
        className='hidden dark:block'
        src='/assets/index-logo-full-white.svg'
        alt='Index Coop Logo'
        height={29}
        width={130}
      />
    </>
  )
}
