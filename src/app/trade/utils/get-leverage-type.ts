import {
  isLeverageToken,
  LeverageType,
  type ListedToken,
} from '@indexcoop/tokenlists'

export function getLeverageType(token: ListedToken): LeverageType | null {
  if (!isLeverageToken(token)) return null

  return token.extensions.leverage.type
}

export const isShortType = (type: string | null) =>
  ['Short1x', 'Short2x'].includes(type ?? '')

export const leverageTypeToLabel: Record<LeverageType, string> = {
  Long2x: '2x',
  Long3x: '3x',
  Short1x: '-1x',
  Short2x: '-2x',
}
