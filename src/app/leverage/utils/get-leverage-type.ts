import { LeverageToken } from '@indexcoop/tokenlists'
import { LeverageType } from '../types'

export const getLeverageAction = ({
  isMint,
  isBurn,
  isFromUser,
  isToUser,
  isFromContract,
  isToContract,
}: {
  isMint: boolean
  isBurn: boolean
  isFromUser: boolean
  isToUser: boolean
  isFromContract: boolean
  isToContract: boolean
}): 'open' | 'close' | 'transfer' => {
  if (isMint || (isFromContract && isToUser)) return 'open'
  if (isBurn || (isFromUser && isToContract)) return 'close'

  return 'transfer'
}

export function getLeverageType(token: LeverageToken): LeverageType | null {
  const { leverage } = token.extensions
  switch (leverage.type) {
    case 'Long2x':
      return LeverageType.Long2x
    case 'Long3x':
      return LeverageType.Long3x
    case 'Short1x':
      return LeverageType.Short
    default:
      return null
  }
}
