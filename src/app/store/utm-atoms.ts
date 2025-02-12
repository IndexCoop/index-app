import { atomWithStorage, createJSONStorage } from 'jotai/utils'

export type UtmParam = 'source' | 'medium' | 'campaign' | 'term' | 'content'
export type UtmParamsAtom = Partial<Record<UtmParam, string>>

const storage = createJSONStorage<UtmParamsAtom>(() => sessionStorage)

export const utmParamsAtom = atomWithStorage<UtmParamsAtom>('utm', {}, storage)
