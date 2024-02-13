import './fli-migration-banner.css'

export function FliMigrationBanner() {
  return (
    <div className='banner-custom flex flex-col gap-1 justify-center p-6 rounded-3xl'>
      <h2 className='text-ic-black text-base font-bold'>
        Holding FLI? Upgrade for better cost of carry.
      </h2>
      <p className='text-ic-gray-600 text-xs font-medium'>
        We are migrating our Leverage suite to improved contracts. During this
        time, the FLI tokens are only tradable for the new 2x tokens.
      </p>
    </div>
  )
}
