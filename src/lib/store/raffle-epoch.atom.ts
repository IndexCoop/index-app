import { atomWithStorage, createJSONStorage } from 'jotai/utils'

import { GetApiV2RaffleEpochs200 } from '@/gen'

const storage = createJSONStorage<GetApiV2RaffleEpochs200[number] | null>(
  () => localStorage,
)

export const raffleEpochAtom = atomWithStorage<
  GetApiV2RaffleEpochs200[number] | null
>('raffle-epoch', null, storage)
