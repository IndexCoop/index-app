import { colors, useColorStyles } from '@/lib/styles/colors'

import { InfoIcon, WarningTwoIcon } from '@chakra-ui/icons'
import { Checkbox, Flex, Spacer, Text } from '@chakra-ui/react'

import { RethSupplyCap } from './RethSupplyCap'
import { useRethSupply } from './useRethSupply'

export enum SupplyCapState {
  available,
  capReached,
  capWillExceed,
}

interface RethSupplyCapContainerProps {
  state: SupplyCapState
  //   onChange: (isChecked: boolean) => void
}

export const RethSupplyCapContainer = (props: RethSupplyCapContainerProps) => {
  const { state } = props
  // FIXME: fetch only for icRETH
  const { data: rethSupplyData } = useRethSupply(true)
  const { isDarkMode, styles } = useColorStyles()
  const backgroundColor = isDarkMode ? colors.icGray3 : colors.icGray1
  return (
    <Flex
      bg='linear-gradient(218deg, #FAFCFC 0%, #F8FAFA 25.23%, #FFF 56.34%, #F9FAFA 89.45%)'
      borderRadius='24px'
      boxShadow='0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.17), -1px -1px 4px 0px rgba(255, 255, 255, 0.88) inset'
      direction='column'
      p='16px'
      w='370px'
    >
      <TitleAndDescription />
      <Flex mt='24px'>
        <RethSupplyCap
          formatted={{ available: '21', cap: '40,000', totalSupply: '0' }}
          totalSupplyPercent={102.45}
        />
      </Flex>
      {(state === SupplyCapState.capReached ||
        state === SupplyCapState.capWillExceed) && (
        <Flex mt='24px'>
          <ErrorMessage state={state} />
        </Flex>
      )}
    </Flex>
  )
}

const ErrorMessage = ({ state }: { state: SupplyCapState }) => {
  const { styles } = useColorStyles()
  return (
    <Flex direction={'column'}>
      <Flex align='center'>
        <WarningTwoIcon color={colors.icRed} height='16px' width='16px' />
        <Text color={styles.text} fontSize='16px' fontWeight='700' mx='12px'>
          Minting not possible
        </Text>
      </Flex>
      {state === SupplyCapState.capReached && (
        <Text mt='4px' fontSize='14px' fontWeight='400'>
          You have exceeded the supply limit.
          <br />
          Please reduce icRETH to mint.
        </Text>
      )}
      {state === SupplyCapState.capWillExceed && (
        <Text mt='4px' fontSize='14px' fontWeight='400'>
          The supply limit for icRETH is reached. It is not possible to mint
          more icRETH at this moment.
        </Text>
      )}
    </Flex>
  )
}

const TitleAndDescription = () => {
  const { styles } = useColorStyles()
  return (
    <Flex direction={'column'}>
      <Flex align='center'>
        <InfoIcon color={colors.icBlue4} height='20px' width='20px' />
        <Text color={styles.text} fontSize='16px' fontWeight='600' mx='12px'>
          icRETH Supply Cap
        </Text>
      </Flex>
      <Text mt='16px' fontSize='16px' fontWeight='400'>
        This specific product has a rigid supply cap and cannot be minted beyond
        it.
      </Text>
    </Flex>
  )
}
