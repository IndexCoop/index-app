import { isYieldPageEnabled } from '@/feature-flags'

import { Header as NewHeader } from './new-header'
import { Header as OldHeader } from './old-header'

export function Header() {
  return isYieldPageEnabled() ? <NewHeader /> : <OldHeader />
}
