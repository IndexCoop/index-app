import { PopupButton } from '@typeform/embed-react'

const surveyTracking = { utm_source: 'app' }

export function LeverageFeedbackButton() {
  return (
    <PopupButton
      id='Ns10DhMF'
      className='hover:text-ic-white hidden h-12 w-full rounded-3xl bg-zinc-800 py-2.5 font-semibold text-neutral-400 transition hover:bg-zinc-700 lg:block'
      tracking={surveyTracking}
    >
      Give us your feedback!
    </PopupButton>
  )
}
