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
