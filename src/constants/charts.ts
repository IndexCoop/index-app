import { ChartPeriod } from '@/components/charts/types'

export const tooltipTimestampFormat: { [k in ChartPeriod]: string } = {
  [ChartPeriod.Hour]: 'DD MMM YYYY HH:mm',
  [ChartPeriod.Day]: 'DD MMM YYYY HH:mm',
  [ChartPeriod.Week]: 'DD MMM YYYY HH:mm',
  [ChartPeriod.Month]: 'DD MMM YYYY HH:mm',
  [ChartPeriod.Year]: 'DD MMM YYYY',
}
