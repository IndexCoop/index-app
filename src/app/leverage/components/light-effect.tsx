export const LightEffect = ({ page }: { page: 'leverage' | 'earn' }) => (
  <div className='relative hidden h-auto w-full overflow-hidden md:block'>
    <div className={`light-effect-${page}`} />
  </div>
)
