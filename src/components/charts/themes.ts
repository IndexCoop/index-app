import { buildChartTheme } from '@visx/xychart'

export const darkTheme = buildChartTheme({
  backgroundColor: '#1C2C2E',
  colors: ['#84e9e9'],
  xAxisLineStyles: { color: '#364746' },
  yAxisLineStyles: { color: '#364746' },
  xTickLineStyles: { color: '#364746' },
  yTickLineStyles: { color: '#364746' },
  tickLength: 6,
  svgLabelBig: { fill: '#A6B4B4' },
  svgLabelSmall: { fill: '#A6B4B4' },
  htmlLabel: { color: '#A6B4B4' },
  gridColor: '#364746',
  gridColorDark: '#364746',
})

export const lightTheme = buildChartTheme({
  backgroundColor: '#F7F8F8',
  colors: ['#44d7d7'],
  xAxisLineStyles: { color: '#627171' },
  yAxisLineStyles: { color: '#627171' },
  xTickLineStyles: { color: '#627171' },
  yTickLineStyles: { color: '#627171' },
  tickLength: 6,
  svgLabelBig: { fill: '#004d53' },
  svgLabelSmall: { fill: '#004d53' },
  htmlLabel: { color: '#004d53' },
  gridColor: '#627171',
  gridColorDark: '#627171',
})
