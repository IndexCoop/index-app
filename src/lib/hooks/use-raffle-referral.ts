import { useAtom } from 'jotai'
import { useState } from 'react'

import { userMetadataAtom } from '@/app/store/user-metadata-atoms'
import { QUERY_PARAM_REFERRAL } from '@/constants'

export function useRaffleReferral() {
  const [copied, setCopied] = useState(false)
  const [userMetadata] = useAtom(userMetadataAtom)

  const hasReferralCode = !!userMetadata?.referralCode
  const referralLink = hasReferralCode
    ? `${window.location.origin}?${QUERY_PARAM_REFERRAL}=${userMetadata.referralCode}`
    : ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = () => {
    const linkWithoutProtocol = referralLink.replace(/^https?:\/\//, '')
    const tweetText = `I'm participating in @indexcoop Leverage RUSH\n\nJoin the campaign with my code:\n${linkWithoutProtocol}`
    const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`

    // Universal Links (iOS) and App Links (Android) will automatically
    // open the X app if installed, otherwise opens in browser
    window.open(xUrl, '_blank')
  }

  return {
    hasReferralCode,
    referralLink,
    copied,
    handleCopy,
    handleShare,
  }
}
