import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { useAtom } from 'jotai'

import { userMetadataAtom } from '@/lib/store/user-metadata-atoms'
import { cn } from '@/lib/utils/tailwind'

export const ReferralChip = ({ className }: { className?: string }) => {
  const [userMetadata] = useAtom(userMetadataAtom)

  const referrerCode = userMetadata?.referrerCode

  if (!referrerCode) return null

  return (
    <div
      className={cn(
        'hidden items-center gap-1 whitespace-nowrap rounded-2xl border border-[#496C72] bg-[#1A2B2F] px-1 py-0 shadow-[0_0_8.4px_0_rgba(255,255,255,0.29)] sm:flex',
        className,
      )}
    >
      <CheckCircleIcon className='text-ic-gray-400 h-5 w-5' />
      <span className='text-ic-gray-400 text-xs'>Ref code</span>
      <span className='text-ic-blue-100 text-xs font-bold'>{referrerCode}</span>
    </div>
  )
}
