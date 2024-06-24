import { ReadonlyURLSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { isExodusCampaignEnabled } from '@/feature-flags'
import './exodus-campaign-banner.css'

const CAMPAIGN_KEY = 'cid'
const CAMPAIGN_VALUE = 'exodus-hyeth'

export function isExodusCampaign(searchParams: ReadonlyURLSearchParams) {
  if (!isExodusCampaignEnabled()) return false
  try {
    // Campaign valid through 7/31/24
    if (Date.now() > 1722484800000) return false

    if (searchParams.get(CAMPAIGN_KEY) === CAMPAIGN_VALUE) return true

    if (window.localStorage.getItem(CAMPAIGN_KEY) === CAMPAIGN_VALUE)
      return true

    return false
  } catch (e) {
    console.error('isExodusCampaign error', e)
    return false
  }
}

export function ExodusCampaignBanner() {
  useEffect(() => {
    try {
      // Store the campaign so it persists through URL changes and reloads
      if (window.localStorage.getItem(CAMPAIGN_KEY) !== CAMPAIGN_VALUE) {
        window.localStorage.setItem(CAMPAIGN_KEY, CAMPAIGN_VALUE)
      }
    } catch (e) {
      console.error('ExodusCampaignBanner error', e)
    }
  }, [])

  return (
    <div className='exodus-campaign-banner flex flex-col justify-center gap-1 rounded-3xl px-6 py-4'>
      <h2 className='text-ic-black mb-1 text-center text-base font-bold'>
        Exodus Users Earn More with hyETH
      </h2>
      <p className='text-ic-gray-700 text-center text-sm font-medium'>
        Purchase hyETH and receive an additional 10% APY boost for holding it
        for one month
      </p>
    </div>
  )
}
