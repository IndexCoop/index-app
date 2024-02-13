import './fli-migration-banner.css'

export function FliMigrationBanner() {
  return (
    <div className='banner-custom flex flex-col justify-center gap-1 rounded-3xl p-6'>
      <h2 className='text-base font-bold text-ic-black'>
        Holding FLI? Upgrade for better cost of carry.
      </h2>
      <p className='text-xs font-medium text-ic-gray-600'>
        We are migrating our Leverage suite to improved contracts. During this
        time, the FLI tokens are only tradable for the new 2x tokens.
      </p>
    </div>
  )
}
