type QuoteNotAvailableProps = {
  type: string
}

export const QuoteNotAvailable = ({ type }: QuoteNotAvailableProps) => {
  const isFlashmint = type === 'Flash Mint'
  const text = isFlashmint ? 'flash minting' : 'swapping'
  return (
    <div className='bg-ic-gray-50 flex h-[110px] w-full cursor-pointer flex-col rounded-xl p-4'>
      <div className='flex justify-end'>
        <p className='text-ic-gray-400 text-sm font-semibold'>
          {type.toUpperCase()}
        </p>
      </div>
      <p className='text-ic-gray-300 text-base font-medium'>
        {type} unavailable
      </p>
      <p className='text-ic-gray-300 text-sm font-normal'>
        {`This token is not available for ${text}.`}
      </p>
    </div>
  )
}
