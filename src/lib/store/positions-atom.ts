import { atom } from 'jotai'
import { Address } from 'viem'

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
      const positions = await getLeverageHistory(address as Address, chainId)

      set(positionsAtom, positions)

      return positions
    } catch (e) {
      console.error('Failed to fetch user:', e)

      return positionsAtomDefaultValue
    }
  },
)
