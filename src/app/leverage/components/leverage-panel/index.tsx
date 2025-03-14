import { LeveragePanelDesktop } from '@/app/leverage/components/leverage-panel/leverage-panel-desktop'
import { LeveragePanelMobile } from '@/app/leverage/components/leverage-panel/leverage-panel-mobile'

export function LeveragePanel() {
  return (
    <>
      <LeveragePanelMobile />
      <LeveragePanelDesktop />
    </>
  )
}
