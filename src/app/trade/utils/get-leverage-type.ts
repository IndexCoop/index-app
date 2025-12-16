import {
  LeverageToken,
  LeverageType as LeverageTypeS,
} from '@indexcoop/tokenlists'

import { LeverageType } from '../types'

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

export const leverageShortTypeMap: Record<LeverageTypeS, string> = {
  Short1x: '-1x',
  Short2x: '-2x',
  Long2x: '2x',
  Long3x: '3x',
}
