import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip'

export const FlashMintTag = () => (
  <Tooltip placement='bottom-end'>
    <TooltipTrigger className='text-ic-gray-500 flex w-full border px-3 py-1 text-xs font-medium'>
      <p className='text-ic-gray-600 text-xs font-semibold'>Flash Mint</p>
    </TooltipTrigger>
    <TooltipContent className='bg-ic-white text-ic-gray-600 max-w-xs rounded-md border-[0.5px] border-gray-300 px-4 py-3 text-left text-[11px] font-medium'>
      Flash Mint enables users to indirectly buy components of an Index token
      and then mint a new unit, providing significant cost savings and deep
      liquidity for large cryptocurrency trades.
    </TooltipContent>
  </Tooltip>
)
