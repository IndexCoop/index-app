import { atom } from 'jotai'

import { GetApiV2UserAddressPositions200 } from '@/gen'

export type LeveragePositions = {
  open: GetApiV2UserAddressPositions200
  history: GetApiV2UserAddressPositions200
  stats: {
    [key: string]: number
  }
}

export type EarnPositions = {
  open: GetApiV2UserAddressPositions200
  history: GetApiV2UserAddressPositions200
  prices: Record<string, Record<string, number>>
}

const positionsAtomDefaultValue: LeveragePositions = {
  open: [],
  history: [],
  stats: {},
}

export const positionsAtom = atom<LeveragePositions>(positionsAtomDefaultValue)

export const fetchLeveragePositionsAtom = atom(
  null,
  async (_, set, address: string, chainId: number) => {
    try {
      const positions = (await (
        await fetch('/api/leverage/history', {
          method: 'POST',
          body: JSON.stringify({
            user: address,
            chainId,
          }),
        })
      ).json()) as LeveragePositions

      set(positionsAtom, positions)

      return positions
    } catch (e) {
      console.error('Failed to fetch user:', e)

      return positionsAtomDefaultValue
    }
  },
)
