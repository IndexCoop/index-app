import { Settings } from '@/components/settings'
import { useSlippage } from '@/lib/providers/slippage'

type SwapNavigationProps = {
  onClickBuy: () => void
}

export function SwapNavigation(props: SwapNavigationProps) {
  const {
    auto: autoSlippage,
    isAuto: isAutoSlippage,
    set: setSlippage,
    slippage,
  } = useSlippage()
  return (
    <div className='flex flex-row justify-between'>
      <div className='my-4 ml-3 flex flex-row gap-8'>
        <div className='text-ic-gray-900 text-base font-medium'>Swap</div>
        <div
          className='text-ic-gray-600 hover:text-ic-gray-900 cursor-pointer text-base font-medium'
          onClick={props.onClickBuy}
        >
          Buy
        </div>
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
