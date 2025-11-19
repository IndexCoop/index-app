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
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    if (isMobile) {
      // Try to open X/Twitter app on mobile
      const twitterAppUrl = `twitter://post?message=${encodeURIComponent(tweetText)}`
      const xWebUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`

      // Attempt to open the app
      window.location.href = twitterAppUrl

      // Fallback to web if app not installed (after a brief delay)
      setTimeout(() => {
        window.location.href = xWebUrl
      }, 500)
    } else {
      // Desktop: use web URL
      const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`
      window.open(xUrl, '_blank')
    }
  }

  return {
    hasReferralCode,
    referralLink,
    copied,
    handleCopy,
    handleShare,
  }
}
