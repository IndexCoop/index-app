import { PrtCard } from '@/app/prt-staking/components/prt-section/prt-card'
import { PrtPopup } from '@/app/prt-staking/components/prt-section/prt-popup'
import { PrtStakingContextProvider } from '@/app/prt-staking/provider'
import { ProductRevenueToken } from '@/app/prt-staking/types'
import { useDisclosure } from '@/lib/hooks/use-disclosure'

type Props = {
  token: ProductRevenueToken
}
export function PrtFrame({ token }: Props) {
  const {
    isOpen: isPrtPopupOpen,
    onOpen: onOpenPrtPopup,
    onClose: onClosePrtPopup,
  } = useDisclosure()

  return (
    <PrtStakingContextProvider token={token}>
      <PrtCard onClick={onOpenPrtPopup} />
      <PrtPopup isOpen={isPrtPopupOpen} onClose={onClosePrtPopup} />
    </PrtStakingContextProvider>
  )
}
