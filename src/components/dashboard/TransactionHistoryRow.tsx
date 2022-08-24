import { colors, useColorStyles } from 'styles/colors'

import {
  Box,
  Flex,
  Image,
  Link,
  Td,
  Text,
  Tr,
  useBreakpointValue,
} from '@chakra-ui/react'

import historyLinkIcon from 'assets/history-link-icon.svg'
import arrowAsset from 'assets/ic_arrow_right_24.svg'

import { TransactionHistoryItem } from './TransactionHistoryTable'

const backgroundColor = colors.icBlue10
const highlightColor = colors.icBlue2

const TransactionHistoryRow = (props: { item: TransactionHistoryItem }) => {
  const { styles } = useColorStyles()
  const isWeb = useBreakpointValue({
    base: false,
    md: true,
    lg: true,
    xl: true,
  })
  const isTablet = useBreakpointValue({
    base: false,
    md: true,
    lg: true,
    xl: false,
  })
  const { item } = props
  return (
    <Tr width={['340px', '400px', '800px', '1024px']}>
      <Td borderBottomColor={styles.border}>
        <Flex align='center'>
          <Flex
            align='center'
            backgroundColor={backgroundColor}
            borderRadius='8px'
            justify='center'
            padding='4px 8px'
          >
            <Text color={highlightColor} fontSize='12px' fontWeight='500'>
              {item.type}
            </Text>
          </Flex>
        </Flex>
      </Td>
      <Td borderBottomColor={styles.border}>
        <Flex direction='column'>
          <Text>${item.asset}</Text>
          {isWeb && <Text color={highlightColor}>{item.value}</Text>}
        </Flex>
      </Td>
      {isWeb && (
        <>
          <Td borderBottomColor={styles.border}>{item.from}</Td>
          {!isTablet && (
            <Td borderBottomColor={styles.border}>
              <Image src={arrowAsset} alt='arrow pointing right' />
            </Td>
          )}
          <Td borderBottomColor={styles.border}>{item.to}</Td>
          {!isTablet && (
            <Td borderBottomColor={styles.border}>
              <Flex direction='column'>
                <Text color='gray'>{item.hash}</Text>
                <Text>Block {item.date}</Text>
              </Flex>
            </Td>
          )}
        </>
      )}
      <Td borderBottomColor={styles.border}>
        <Link href={item.explorerUrl} isExternal>
          <Flex align='center' direction='row' justify='end'>
            View More{' '}
            <Box px='2.5' py='1.5'>
              <Image src={historyLinkIcon} alt='link icon' />
            </Box>
          </Flex>
        </Link>
      </Td>
    </Tr>
  )
}

export default TransactionHistoryRow
