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
      <div className='text-ic-gray-800 text-xs font-medium'>
        {`Unwrap ${token.symbol}`}
      </div>
    </div>
  )
}

export function FliMigrationBanner() {
  const router = useRouter()
  const onClickBtc2xFli = () => {
    router.push('/swap/btc2x-fli/btc2x')
  }
  const onClickEth2xFli = () => {
    router.push('/swap/eth2x-fli/eth2x')
  }
  return (
    <div className='banner-custom flex flex-col justify-center gap-1 rounded-3xl px-6 py-4'>
      <h2 className='text-ic-black text-center text-base font-bold'>
        Holding FLIs? Unwrap for upgraded 2x tokens.
      </h2>
      <p className='text-ic-gray-600 text-xs font-medium'>
        FLI tokens have migrated to modernized 2x tokens on Index Protocol. FLI
        Tokens may be unwrapped in exchange for new 2x tokens.
      </p>
      <div className='mt-2 flex w-full flex-row items-center justify-evenly gap-5'>
        <button
          className='flex flex-grow cursor-pointer'
          onClick={onClickEth2xFli}
        >
          <MigrateButton token={Ethereum2xFlexibleLeverageIndex} />
        </button>
        <button
          className='flex flex-grow cursor-pointer'
          onClick={onClickBtc2xFli}
        >
          <MigrateButton token={Bitcoin2xFlexibleLeverageIndex} />
        </button>
      </div>
    </div>
  )
}
