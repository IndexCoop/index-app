'use client'

export function Hero() {
  const handleClick = () => {
    const productScrollElement = document.getElementById('product-scroll')
    if (productScrollElement) {
      window.scrollTo({
        top:
          productScrollElement.getBoundingClientRect().top +
          window.scrollY -
          90,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className='flex flex-col items-center space-y-10 md:space-y-12'>
      <h2 className='text-ic-gray-800 text-3xl md:text-4xl lg:text-5xl font-bold text-center max-w-3xl'>
        Sophisticated DeFi Strategies accessible in one click.
      </h2>
      <h3 className='text-ic-gray-500 font-medium text-sm md:text-base text-center max-w-lg'>
        Unlock powerful sector, leverage and yield-earning strategies with our
        simple tokens.
      </h3>
      <button
        className='bg-ic-blue-500 text-ic-white px-11 py-3 rounded-lg hover:bg-ic-blue-400'
        onClick={handleClick}
      >
        Explore Products
      </button>
    </div>
  )
}
