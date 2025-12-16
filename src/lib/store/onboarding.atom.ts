import { atomWithStorage, createJSONStorage } from 'jotai/utils'

type OnboardingAtom = {
  shown: boolean
}

const storage = createJSONStorage<OnboardingAtom>(() => localStorage)

export const onboardingAtom = atomWithStorage<OnboardingAtom>(
  'onboarding',
  { shown: false },
  storage,
)
