import { atom } from 'jotai'

import { getLeverageHistory, LeveragePositions } from '@/lib/actions/leverage'

const positionsAtomDefaultValue: LeveragePositions = {
  open: [],
  history: [],
  stats: {},
}

export const positionsAtom = atom<LeveragePositions>(positionsAtomDefaultValue)

export const fetchPositionsAtom = atom(
  null,
  async (_, set, address: string, chainId: number) => {
    try {
      const { data } = await getLeverageHistory(address, chainId)

      if (!data) {
        return positionsAtomDefaultValue
      }

      set(positionsAtom, data)

      return data
    } catch (e) {
      console.error('Failed to fetch user:', e)

      return positionsAtomDefaultValue
    }
  },
)
