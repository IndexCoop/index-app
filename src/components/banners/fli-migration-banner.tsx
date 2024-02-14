import Image from 'next/image'
import { useRouter } from 'next/navigation'

import {
  Bitcoin2xFlexibleLeverageIndex,
  Ethereum2xFlexibleLeverageIndex,
  Token,
} from '@/constants/tokens'

import './fli-migration-banner.css'

function MigrateButton({ token }: { token: Token }) {
  return (
    <div className='button flex w-full flex-row items-center justify-center gap-2 p-3'>
      <Image
        alt={`${token.symbol} logo`}
        src={token.image}
        width={20}
        height={20}
      />
      <div className='text-xs font-medium text-ic-gray-800'>
        {`Migrate ${token.symbol} Position`}
      </div>
    </div>
  )
}

export function FliMigrationBanner() {
  const router = useRouter()
  const onClickBtc2xFli = () => {
    router.push('/swap/btc2x-fli/eth')
  }
  const onClickEth2xFli = () => {
    router.push('/swap/eth2x-fli/eth')
  }
  return (
    <div className='banner-custom flex flex-col justify-center gap-1 rounded-3xl px-6 py-4'>
      <h2 className='text-center text-base font-bold text-ic-black'>
        Holding FLI? Upgrade for better cost of carry.
      </h2>
      <p className='text-xs font-medium text-ic-gray-600'>
        We are migrating our Leverage suite to improved contracts. During this
        time, the FLI tokens are only tradable for the new 2x tokens.
      </p>
      <div className='mt-2 flex w-full flex-row items-center justify-evenly gap-5'>
        <div
          className='flex flex-grow cursor-pointer'
          onClick={onClickEth2xFli}
        >
          <MigrateButton token={Ethereum2xFlexibleLeverageIndex} />
        </div>
        <div
          className='flex flex-grow cursor-pointer'
          onClick={onClickBtc2xFli}
        >
          <MigrateButton token={Bitcoin2xFlexibleLeverageIndex} />
        </div>
      </div>
    </div>
  )
}
