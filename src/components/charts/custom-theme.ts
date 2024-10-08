import { buildChartTheme } from '@visx/xychart'

export const customTheme = buildChartTheme({
  backgroundColor: '#1C2C2E',
  colors: ['#84e9e9'],
  xAxisLineStyles: { color: '#364746' },
  yAxisLineStyles: { color: '#364746' },
  xTickLineStyles: { color: '#364746' },
  yTickLineStyles: { color: '#364746' },
  tickLength: 4,
  svgLabelBig: { fill: '#A6B4B4' },
  svgLabelSmall: { fill: '#A6B4B4' },
  htmlLabel: { color: '#A6B4B4' },
  gridColor: '#364746',
  gridColorDark: '#364746',
})
