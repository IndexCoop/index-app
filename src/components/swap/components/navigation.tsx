import { Settings } from '@/components/settings'
import { useSlippage } from '@/lib/providers/slippage'

export function SwapNavigation() {
  const {
    auto: autoSlippage,
    isAuto: isAutoSlippage,
    set: setSlippage,
    slippage,
  } = useSlippage()
  return (
    <div className='flex flex-row items-center justify-between'>
      <div className='my-4 ml-3 flex flex-row gap-8'>
        <div className='text-ic-gray-900 text-base font-medium'>Swap</div>
      </div>
      <Settings
        isAuto={isAutoSlippage}
        isDarkMode={false}
        slippage={slippage}
        onChangeSlippage={setSlippage}
        onClickAuto={autoSlippage}
      />
    </div>
  )
}
