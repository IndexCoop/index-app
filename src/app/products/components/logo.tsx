import Image from 'next/image'

export function Logo() {
  return (
    <Image
      className='min-w-[32px]'
      src='/logo.png'
      alt='Index Coop Logo'
      height={32}
      width={32}
      priority
    />
  )
}
