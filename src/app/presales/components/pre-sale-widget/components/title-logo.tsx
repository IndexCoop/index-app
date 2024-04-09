import Image from 'next/image'

type TitleLogoProps = {
  logo: string
  symbol: string
}

export function TitleLogo({ logo, symbol }: TitleLogoProps) {
  return (
    <div className='text-ic-white flex flex-1 self-center text-base font-bold'>
      <div className='my-auto mr-2 overflow-hidden rounded-full'>
        <Image
          src={logo ?? '/assets/index-token.png'}
          alt={`${symbol} logo`}
          height={28}
          width={28}
        />
      </div>
      {symbol}
    </div>
  )
}
