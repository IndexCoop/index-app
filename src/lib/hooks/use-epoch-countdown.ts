import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useEffect, useState } from 'react'

dayjs.extend(duration)

export const useEpochCountdown = (endDate?: string | null) => {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (!endDate) {
      setTimeLeft('')
      return
    }

    const updateCountdown = () => {
      const now = dayjs()
      const end = dayjs(endDate)
      const diff = end.diff(now)

      if (diff <= 0) {
        setTimeLeft('Ended')
        return
      }

      const dur = dayjs.duration(diff)
      const days = Math.floor(dur.asDays())
      const hours = dur.hours()
      const minutes = dur.minutes()
      const seconds = dur.seconds()

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`)
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`)
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [endDate])

  return timeLeft
}
