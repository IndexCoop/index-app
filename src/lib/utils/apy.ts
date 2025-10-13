import { IndexData } from '@/lib/utils/api/index-data-provider'

export function calculateApy({
  APY = 0,
  ApyCost = 0,
  ApyStreamingFee = 0,
}: Partial<IndexData>) {
  return (APY + ApyCost + ApyStreamingFee) / 100
}
