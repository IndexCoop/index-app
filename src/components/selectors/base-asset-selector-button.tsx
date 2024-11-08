import Image from 'next/image'

type SelectorButtonProps = {
  imagePath: { selected: string; disabled: string }
  isSelected: boolean
  onClick: () => void
}

export function BaseAssetSelectorButton({
  imagePath,
  isSelected,
  onClick,
}: SelectorButtonProps) {
  const path = isSelected ? imagePath.selected : imagePath.disabled
  return (
    <div
      className={'h-11 w-11 cursor-pointer sm:h-14 sm:w-14'}
      onClick={onClick}
    >
      <Image src={path} alt={`logo`} height={56} width={56} />
    </div>
  )
}
