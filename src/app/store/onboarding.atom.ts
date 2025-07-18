import { atomWithStorage, createJSONStorage } from 'jotai/utils'

export type OnboardingAtom = {
  shown: boolean
}

const storage = createJSONStorage<OnboardingAtom>(() => localStorage)

export const onboardingAtom = atomWithStorage<OnboardingAtom>(
  'onboarding',
  { shown: false },
  storage,
)
