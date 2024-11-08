import { Token } from '@/constants/tokens'

import { BaseAssetSelectorButton } from './base-asset-selector-button'

type BaseAssetSelectorProps = {
  baseTokens: Token[]
  selectedBaseToken: Token
  onSelectBaseAsset: (symbol: string) => void
}

export function BaseAssetSelector(props: BaseAssetSelectorProps) {
  return (
    <div className='flex flex-col gap-3'>
      <div className='text-xs font-normal text-gray-100'>Base Asset</div>
      <div className='flex flex-row gap-1 sm:gap-2'>
        {props.baseTokens.some((token) => token.symbol === 'ETH') && (
          <BaseAssetSelectorButton
            imagePath={{
              selected: '/assets/selector-base-asset-eth.png',
              disabled: '/assets/selector-base-asset-eth-disabled.png',
            }}
            isSelected={props.selectedBaseToken.symbol === 'ETH'}
            onClick={() => {
              props.onSelectBaseAsset('ETH')
            }}
          />
        )}
        {props.baseTokens.some((token) => token.symbol === 'BTC') && (
          <BaseAssetSelectorButton
            imagePath={{
              selected: '/assets/selector-base-asset-btc.png',
              disabled: '/assets/selector-base-asset-btc-disabled.png',
            }}
            isSelected={props.selectedBaseToken.symbol === 'BTC'}
            onClick={() => {
              props.onSelectBaseAsset('BTC')
            }}
          />
        )}
      </div>
    </div>
  )
}
