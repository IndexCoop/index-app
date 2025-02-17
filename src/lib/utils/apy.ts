import { IndexData } from '@/lib/utils/api/index-data-provider'

export function calculateApy({
  APY = 0,
  Rate = 0,
  StreamingFee = 0,
}: Partial<IndexData>) {
  return (APY + Rate + StreamingFee) / 100
}
