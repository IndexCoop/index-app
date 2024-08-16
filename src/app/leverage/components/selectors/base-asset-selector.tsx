type BaseAssetSelectorProps = {
  onSelectBaseAsset: (symbol: string) => void
}

export function BaseAssetSelector(props: BaseAssetSelectorProps) {
  return (
    <div className='flex flex-col'>
      <div className='text-xs font-normal text-gray-100'>Base Asset</div>
      <div></div>
    </div>
  )
}
