import { useDisclosure } from '@chakra-ui/react'

import { PrtCard } from '@/app/prt-staking/components/prt-section/prt-card'
import { PrtPopup } from '@/app/prt-staking/components/prt-section/prt-popup'
import { PrtStakingContextProvider } from '@/app/prt-staking/provider'
import { ProductRevenueToken } from '@/app/prt-staking/types'

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
    <PrtStakingContextProvider tokenData={token.tokenData}>
      <PrtCard token={token} onClick={onOpenPrtPopup} />
      <PrtPopup
        token={token}
        isOpen={isPrtPopupOpen}
        onClose={onClosePrtPopup}
      />
    </PrtStakingContextProvider>
  )
}
