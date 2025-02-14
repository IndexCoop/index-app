import { PopupButton } from '@typeform/embed-react'

const surveyTracking = { utm_source: 'app' }

export function LeverageFeedbackButton() {
  return (
    <PopupButton
      id='Ns10DhMF'
      className='text-ic-black bg-ic-gray-700 hover:bg-ic-gray-500 h-12 w-full rounded-lg py-2.5 font-bold'
      tracking={surveyTracking}
    >
      Give us your feedback!
    </PopupButton>
  )
}
