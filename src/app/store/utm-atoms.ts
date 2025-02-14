import { atomWithStorage, createJSONStorage } from 'jotai/utils'

export type UtmParam =
  | 'utm_source'
  | 'utm_medium'
  | 'utm_campaign'
  | 'utm_term'
  | 'utm_content'
export type UtmParamsAtom = Partial<Record<UtmParam, string>>

const storage = createJSONStorage<UtmParamsAtom>(() => sessionStorage)

export const utmParamsAtom = atomWithStorage<UtmParamsAtom>('utm', {}, storage)
