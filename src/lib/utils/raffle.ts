import type { GetApiV2RaffleEpochs200 } from '@/gen'

type Epoch = GetApiV2RaffleEpochs200[number]

/**
 * Selects the most appropriate epoch to display based on priority:
 * 1. Active epoch (currently running and not completed)
 * 2. Most recent completed epoch with winners (drawCompleted = true)
 * 3. Most recent epoch by date
 */
export function selectDefaultEpoch<T extends Epoch>(epochs: T[]): T | null {
  if (epochs.length === 0) return null

  const now = new Date()

  // Priority 1: Find active epoch
  const activeEpoch = epochs.find((epoch) => {
    const start = new Date(epoch.startDate)
    const end = new Date(epoch.endDate)
    return now >= start && now < end && !epoch.drawCompleted
  })

  if (activeEpoch) {
    return activeEpoch
  }

  // Priority 2: Find most recent completed epoch with winners
  const completedEpochWithWinners = epochs.find((epoch) => epoch.drawCompleted)

  if (completedEpochWithWinners) {
    return completedEpochWithWinners
  }

  // Priority 3: Fall back to the most recent epoch
  return epochs[0]
}
