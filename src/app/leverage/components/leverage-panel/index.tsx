import { LeveragePanelDesktop } from '@/app/leverage/components/leverage-panel/leverage-panel-desktop'
import { LeveragePanelMobile } from '@/app/leverage/components/leverage-panel/leverage-panel-mobile'
import { Token } from '@/constants/tokens'

type Props = {
  indexToken: Token
}

export function LeveragePanel({ indexToken }: Props) {
  return (
    <>
      <LeveragePanelMobile indexToken={indexToken} />
      <LeveragePanelDesktop indexToken={indexToken} />
    </>
  )
}
