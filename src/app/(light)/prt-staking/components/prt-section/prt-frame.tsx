import { useDisclosure } from '@chakra-ui/react'

import { PrtCard } from '@/app/(light)/prt-staking/components/prt-section/prt-card'
import { PrtPopup } from '@/app/(light)/prt-staking/components/prt-section/prt-popup'
import { PrtStakingContextProvider } from '@/app/(light)/prt-staking/provider'
import { ProductRevenueToken } from '@/app/(light)/prt-staking/types'

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
