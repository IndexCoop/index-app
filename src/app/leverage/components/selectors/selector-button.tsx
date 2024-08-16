import Image from 'next/image'

type SelectorButtonProps = {
  imagePath: { selected: string; disabled: string }
  isSelected: boolean
  onClick: () => void
}

export function SelectorButton({
  imagePath,
  isSelected,
  onClick,
}: SelectorButtonProps) {
  const path = isSelected ? imagePath.selected : imagePath.disabled
  return (
    <div className={'h-14 w-14 cursor-pointer'} onClick={onClick}>
      <Image src={path} alt={`logo`} height={56} width={56} />
    </div>
  )
}
