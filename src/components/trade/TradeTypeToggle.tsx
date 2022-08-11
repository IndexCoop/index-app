import { colors } from 'styles/colors'

import { Box, Flex, Text } from '@chakra-ui/react'

type TradeTypeToggleProps = {
  isDarkMode: boolean
  isToggled: boolean
  onToggle: (state: boolean) => void
}

const TradeTypeToggle = ({
  isDarkMode,
  isToggled,
  onToggle,
}: TradeTypeToggleProps) =>
  isToggled ? (
    <>
      <Flex
        borderTop='1px solid #F7F1E4'
        borderColor={isDarkMode ? colors.icWhite : colors.black}
        fontSize='14px'
        pt='10px'
        alignItems='center'
        justifyContent='space-between'
      >
        <Text marginRight='12px'>Large Transaction? </Text>
        <Box
          py='4px'
          px='12px'
          border='1px solid  #F7F1E4'
          borderColor={isDarkMode ? colors.icWhite : colors.black}
          borderRadius='16px'
          cursor='pointer'
          _hover={{
            backgroundColor: isDarkMode
              ? colors.icGrayLightMode
              : colors.icGrayDarkMode,
          }}
          onClick={() => onToggle(false)}
        >
          Toggle Token Minting
        </Box>
      </Flex>
    </>
  ) : (
    <>
      <Flex
        borderTop='1px solid #F7F1E4'
        borderColor={isDarkMode ? colors.icWhite : colors.black}
        fontSize='14px'
        py='10px'
        alignItems='center'
        justifyContent='right'
      >
        <Box
          py='4px'
          px='12px'
          border='1px solid  #F7F1E4'
          borderColor={isDarkMode ? colors.icWhite : colors.black}
          borderRadius='16px'
          cursor='pointer'
          _hover={{
            backgroundColor: isDarkMode
              ? colors.icGrayLightMode
              : colors.icGrayDarkMode,
          }}
          onClick={() => onToggle(true)}
        >
          Toggle Dex Swap
        </Box>
      </Flex>
    </>
  )

export default TradeTypeToggle
