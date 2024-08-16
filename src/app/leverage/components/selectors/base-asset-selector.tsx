import { useState } from 'react'

import { SelectorButton } from './selector-button'

type BaseAssetSelectorProps = {
  onSelectBaseAsset: (symbol: string) => void
}

export function BaseAssetSelector(props: BaseAssetSelectorProps) {
  const [isSelected, setSelected] = useState(true)
  return (
    <div className='flex flex-col gap-3'>
      <div className='text-xs font-normal text-gray-100'>Base Asset</div>
      <div className='flex flex-row gap-1'>
        <SelectorButton
          imagePath={{
            selected: '/assets/selector-base-asset-eth.png',
            disabled: '/assets/selector-base-asset-eth-disabled.png',
          }}
          isSelected={isSelected}
          onClick={() => {
            setSelected(true)
            props.onSelectBaseAsset('ETH')
          }}
        />
        <SelectorButton
          imagePath={{
            selected: '/assets/selector-base-asset-btc.png',
            disabled: '/assets/selector-base-asset-btc-disabled.png',
          }}
          isSelected={!isSelected}
          onClick={() => {
            setSelected(false)
            props.onSelectBaseAsset('BTC')
          }}
        />
      </div>
    </div>
  )
}
