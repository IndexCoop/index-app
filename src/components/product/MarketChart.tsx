import { useEffect, useState } from 'react'

import { Line, LineChart, YAxis } from 'recharts'

import { Flex, Spacer } from '@chakra-ui/layout'
import { Button, theme } from '@chakra-ui/react'

import { ProductToken } from 'constants/productTokens'
import {
  TokenMarketDataValues,
  useMarketData,
} from 'contexts/MarketData/MarketDataProvider'

enum PriceChartRangeOption {
  DAILY_PRICE_RANGE = 1,
  WEEKLY_PRICE_RANGE = 7,
  MONTHLY_PRICE_RANGE = 30,
  QUARTERLY_PRICE_RANGE = 90,
  YEARLY_PRICE_RANGE = 365,
}

enum Durations {
  DAILY = 0,
  WEEKLY = 1,
  MONTHLY = 2,
  QUARTERLY = 3,
  YEARLY = 4,
}

const MarketChart = (props: {
  productToken: ProductToken
  marketData: TokenMarketDataValues
  onMouseMove?: (...args: any[]) => any
  onMouseLeave?: (...args: any[]) => any
}) => {
  const { selectLatestMarketData } = useMarketData()
  const formatFloats = (n: number) => n.toFixed(2)
  const [latestPrice, setLatestPrice] = useState(
    selectLatestMarketData(props.marketData.hourlyPrices)
  )
  const [chartRange, setChartRange] = useState<number>(
    PriceChartRangeOption.MONTHLY_PRICE_RANGE
  )
  const [prices, setPrices] = useState(props.marketData.prices || [[]])
  const [durationSelector, setDurationSelector] = useState<number>(
    Durations.MONTHLY
  )

  const formatToolTip = (chartData: any) => {
    if (!chartData) return ['--', 'No Data Available']
    const {
      payload: { x, y },
    } = chartData
    let timeString = new Date(x).toLocaleDateString()
    if (durationSelector === Durations.DAILY) {
      timeString = new Date(x).toLocaleTimeString([], {
        hour: 'numeric',
        minute: 'numeric',
      })
    }
    return [timeString, '$' + formatFloats(y)]
  }

  useEffect(() => {
    setTimeout(() => {
      const hourlyDataInterval = 24
      if (props.marketData.hourlyPrices) {
        if (durationSelector === Durations.DAILY) {
          setPrices(
            props.marketData.hourlyPrices.slice(
              -PriceChartRangeOption.DAILY_PRICE_RANGE * hourlyDataInterval
            )
          ) //last day, hourly
        } else if (durationSelector === Durations.WEEKLY) {
          setPrices(
            props.marketData.hourlyPrices.slice(
              -PriceChartRangeOption.WEEKLY_PRICE_RANGE * hourlyDataInterval
            )
          ) //last 7 days, hourly
        } else if (durationSelector === Durations.MONTHLY) {
          setPrices(
            props.marketData.hourlyPrices.slice(
              -PriceChartRangeOption.MONTHLY_PRICE_RANGE * hourlyDataInterval
            )
          ) //last 30 days, hourly
        } else if (durationSelector === Durations.QUARTERLY) {
          setPrices(
            props.marketData.hourlyPrices.slice(
              -PriceChartRangeOption.QUARTERLY_PRICE_RANGE * hourlyDataInterval
            )
          ) //last 90 days, hourly
        } else if (
          durationSelector === Durations.YEARLY &&
          props.marketData.prices
        ) {
          setPrices(
            props.marketData.prices.slice(
              -PriceChartRangeOption.YEARLY_PRICE_RANGE
            )
          ) //last year, daily
        }
      }
    }, 0)
    console.log('hourlyData', prices)
  }, [durationSelector])

  const handleDailyButton = () => {
    setDurationSelector(Durations.DAILY)
    setChartRange(PriceChartRangeOption.DAILY_PRICE_RANGE)
  }

  const handleWeeklyButton = () => {
    setDurationSelector(Durations.WEEKLY)
    setChartRange(PriceChartRangeOption.WEEKLY_PRICE_RANGE)
  }

  const handleMonthlyButton = () => {
    setDurationSelector(Durations.MONTHLY)
    setChartRange(PriceChartRangeOption.MONTHLY_PRICE_RANGE)
  }

  const handleQuarterlyButton = () => {
    setDurationSelector(Durations.QUARTERLY)
    setChartRange(PriceChartRangeOption.QUARTERLY_PRICE_RANGE)
  }

  const handleYearlyButton = () => {
    setDurationSelector(Durations.YEARLY)
    setChartRange(PriceChartRangeOption.YEARLY_PRICE_RANGE)
  }

  const tickFormatter = (val: any) => {
    if (val <= minY) return 'Min: $' + formatFloats(val)
    return 'Max: $' + formatFloats(val)
  }

  const mappedPriceData = () => manualPrices.map(([x, y]) => ({ x, y })) //prices

  const minY = Math.min(...manualPrices.map<number>(([x, y]) => y)) //props.marketData.hourlyPrices
  const maxY = Math.max(...manualPrices.map<number>(([x, y]) => y))
  const minimumYAxisLabel = minY - 5 > 0 ? minY - 5 : 0

  console.log('prices', prices)
  return (
    <Flex
      direction='column'
      alignItems='center'
      margin='20px 40px'
      padding='10px'
      width='70vw'
    >
      <LineChart width={800} height={600} data={mappedPriceData()}>
        <Line type='monotone' dataKey='y' stroke='#FABF00' />
        <YAxis
          stroke={theme.colors.gray[500]}
          tickFormatter={tickFormatter}
          axisLine={false}
          tickLine={false}
          mirror={true}
          ticks={[minimumYAxisLabel + 0.001, maxY + 5.001]}
          domain={[minY - 15, maxY + 5]}
          orientation='right'
          width={100}
          dy={7}
          dx={1}
          hide={true}
        />
      </LineChart>
      <Flex>
        <Button
          full
          size={'sm'}
          text='1D'
          variant={
            durationSelector === Durations.DAILY ? 'default' : 'secondary'
          }
          onClick={handleDailyButton}
        />
        <Spacer size={'sm'} />
        <Button
          full
          size={'sm'}
          text='1W'
          variant={
            durationSelector === Durations.WEEKLY ? 'default' : 'secondary'
          }
          onClick={handleWeeklyButton}
        />
        <Spacer size={'sm'} />
        <Button
          full
          size={'sm'}
          text='1M'
          variant={
            durationSelector === Durations.MONTHLY ? 'default' : 'secondary'
          }
          onClick={handleMonthlyButton}
        />
        <Spacer size={'sm'} />
        <Button
          full
          size={'sm'}
          text='3M'
          variant={
            durationSelector === Durations.QUARTERLY ? 'default' : 'secondary'
          }
          onClick={handleQuarterlyButton}
        />
        <Spacer size={'sm'} />
        <Button
          full
          size={'sm'}
          text='1Y'
          variant={
            durationSelector === Durations.YEARLY ? 'default' : 'secondary'
          }
          onClick={handleYearlyButton}
        />
      </Flex>
    </Flex>
  )
}

export default MarketChart

const manualPrices = [
  [1634224691752, 339.66979030755175],
  [1634227708106, 339.45241356161716],
  [1634231603467, 337.47188910385603],
  [1634235231735, 339.0568927800367],
  [1634238800097, 340.4133451639452],
  [1634242436536, 338.44000081952936],
  [1634245742923, 336.2965792619905],
  [1634249690664, 335.741907425907],
  [1634252869994, 338.3102402095955],
  [1634256281133, 338.5886969753963],
  [1634259843126, 336.63927193859746],
  [1634264049817, 334.85267187500864],
  [1634267665170, 344.6891394075876],
  [1634271252427, 343.22623039640354],
  [1634274862178, 344.103558637952],
  [1634278462926, 344.0922921035211],
  [1634281944799, 341.16528278639385],
  [1634285068063, 340.9593491658835],
  [1634289288329, 336.59673181920374],
  [1634292857648, 335.6375464954446],
  [1634296499237, 335.08199802228637],
  [1634300089491, 336.4767731237203],
  [1634303685583, 335.26351344996175],
  [1634307262805, 338.9067954554178],
  [1634310843960, 339.06635575550456],
  [1634313846679, 337.5737196232765],
  [1634318072099, 341.86999068031696],
  [1634321354144, 342.6117698407463],
  [1634325315601, 342.97357525375713],
  [1634328933315, 341.2770724807398],
  [1634332493259, 343.11182898422527],
  [1634336008111, 339.78608876323113],
  [1634339648176, 340.22694371727596],
  [1634343009008, 341.8608049207765],
  [1634346928264, 342.58766198243285],
  [1634350531528, 339.9817992607785],
  [1634354078995, 340.76456731361185],
  [1634357687927, 340.43823039608617],
  [1634361233099, 341.08314633579306],
  [1634364931008, 341.7164460604206],
  [1634368451936, 342.5048262881533],
  [1634372083824, 340.68109514729053],
  [1634375699175, 347.4606614561381],
  [1634379344365, 347.15924308274117],
  [1634382900994, 346.6742984585428],
  [1634386473541, 350.879874997072],
  [1634390131708, 348.6428185335599],
  [1634393921570, 348.8709870280826],
  [1634397556718, 347.14194113025997],
  [1634401113760, 347.184574560885],
  [1634404695394, 345.41600045970563],
  [1634408048848, 344.34437033997295],
  [1634411941553, 346.8705157708571],
  [1634415516490, 345.5888527803871],
  [1634419083299, 346.5145615372388],
  [1634422692015, 343.7085051185419],
  [1634426311247, 345.3883289980224],
  [1634429436930, 344.25284388903384],
  [1634433572763, 346.26120517256726],
  [1634437163405, 346.8583371400033],
  [1634440698560, 343.8908132992454],
  [1634443783439, 345.33890072851557],
  [1634447814237, 344.7071302059543],
  [1634451591265, 342.73759458179654],
  [1634455105383, 343.09628607243684],
  [1634458179887, 343.3448839832203],
  [1634462364320, 343.78043325925495],
  [1634465364221, 346.77408762721285],
  [1634469562888, 344.2902520424849],
  [1634472085708, 342.6173540456879],
  [1634475862463, 342.2467828165741],
  [1634479489039, 347.1371326128132],
  [1634483363384, 347.34274893527663],
  [1634487272696, 341.5883493537084],
  [1634490856079, 342.41439978665926],
  [1634494513259, 342.2304023580278],
  [1634498135108, 341.7012203296569],
  [1634501714796, 336.2227883117552],
  [1634504610827, 333.1336977283494],
  [1634508543010, 336.911087938271],
  [1634512182453, 339.9413227794456],
  [1634515786070, 340.85371891102636],
  [1634519491313, 341.5094275481895],
  [1634522696457, 340.0909679265146],
  [1634526262927, 341.00200860912383],
  [1634530055040, 340.0525658141361],
  [1634533678839, 340.23149747343393],
  [1634537917513, 341.3327446214746],
  [1634541609905, 341.89878341282645],
  [1634544681830, 338.6639837799586],
  [1634548177277, 336.8025359539856],
  [1634552078093, 333.2934950564885],
  [1634555975442, 333.7719255206076],
  [1634559265821, 330.5619496814447],
  [1634562863492, 329.46551133697477],
  [1634566678204, 336.85163704919444],
  [1634569547051, 335.3413573447971],
  [1634573689740, 330.46430850358735],
  [1634577238559, 325.86719364444843],
  [1634580473047, 327.791183936545],
  [1634584042729, 327.116593251496],
  [1634587730243, 328.86151582263415],
  [1634591561542, 331.2438894867368],
  [1634595107877, 331.6567569582103],
  [1634598166117, 330.4154556866968],
  [1634601896577, 331.6901345230991],
  [1634605731468, 332.45277950733055],
  [1634609365192, 334.6052172021534],
  [1634612826891, 334.47870543005484],
  [1634616515811, 337.1916687293642],
  [1634620174409, 336.1217837268098],
  [1634623783697, 335.8185330565031],
  [1634627685083, 332.0048968050672],
  [1634630709356, 332.7365865242888],
  [1634634923349, 333.54475439833305],
  [1634638519434, 331.8814662735245],
  [1634642024169, 331.7138979429908],
  [1634645877603, 332.38057804523385],
  [1634649251328, 333.0268242495315],
  [1634652921422, 333.60017793549935],
  [1634656575115, 332.0979142547844],
  [1634660386793, 330.14408031386176],
  [1634663783919, 332.25963608079593],
  [1634667252787, 333.32743279051397],
  [1634670548180, 331.85793722326196],
  [1634675013978, 332.8565656008204],
  [1634678358972, 331.7518195092713],
  [1634681318763, 332.0231885150645],
  [1634685578902, 335.5090588814997],
  [1634689368538, 338.1475873255708],
  [1634693024732, 336.6128564478279],
  [1634696789431, 335.25246010608936],
  [1634700566255, 335.87361479977983],
  [1634704136242, 333.0988378808341],
  [1634707390913, 331.44105559973144],
  [1634711090211, 331.44186668690594],
  [1634714996741, 330.7624585841443],
  [1634717710470, 331.4196771391711],
  [1634722129102, 331.2821287230486],
  [1634725289695, 331.32029707180027],
  [1634728671538, 331.3017405245379],
  [1634732933493, 336.316375980312],
  [1634736259001, 339.265721936481],
  [1634740143441, 343.5734019482093],
  [1634743700691, 343.74703788550556],
  [1634746625829, 345.9947087654884],
  [1634750892051, 346.9476646918675],
  [1634753772846, 348.05385119077505],
  [1634757542276, 349.90803837870146],
  [1634761226434, 348.1648187978374],
  [1634764480726, 349.03780673123487],
  [1634768644160, 350.7942863395121],
  [1634772260440, 350.09024270463954],
  [1634775448849, 348.8842543086519],
]
