import { colors } from '@/lib/styles/colors'

import { SettingsIcon } from '@chakra-ui/icons'
import {
  Button,
  Flex,
  IconButton,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react'

type PopoverProps = {
  isAuto: boolean
  isDarkMode: boolean
  onChangeSlippage: (slippage: number) => void
  onClickAuto: () => void
  slippage: number
}

export const QuickTradeSettingsPopover = (props: PopoverProps) => {
  const { isAuto, isDarkMode, slippage, onChangeSlippage, onClickAuto } = props
  const backgroundColor = isDarkMode ? colors.black : colors.icWhite

  return (
    <Popover placement='bottom-end'>
      <PopoverTrigger>
        <IconButton
          aria-label='Trade Settings'
          icon={<SettingsIcon />}
          size='lg'
          style={{ border: 0 }}
          variant='unstyled'
        />
      </PopoverTrigger>
      <PopoverContent bg={backgroundColor} p='8px'>
        <PopoverBody>
          <Text fontSize='md' fontWeight='700' textColor={colors.icBlack}>
            Slippage Settings
          </Text>
          <Flex align='center' my='4'>
            <AutoButton
              isActive={isAuto}
              isDarkMode={isDarkMode}
              onClickAuto={onClickAuto}
            />
            <Flex
              align='center'
              border='1px solid gray'
              borderRadius={10}
              ml='8px'
              px='8px'
            >
              <Input
                fontSize='md'
                placeholder={`${slippage}`}
                _placeholder={{ color: colors.icGray2 }}
                p='8px'
                pr='4px'
                textAlign='right'
                type='number'
                variant='unstyled'
                value={isAuto ? '' : slippage}
                onChange={(event) => {
                  const value = event.target.value
                  let updatedSlippage = parseFloat(value)
                  if (value === '') {
                    onClickAuto()
                    return
                  }
                  if (Number.isNaN(updatedSlippage)) return
                  onChangeSlippage(updatedSlippage)
                }}
              />
              <Text textColor={colors.icBlack}>%</Text>
            </Flex>
          </Flex>
          <Text fontSize='sm' fontWeight='500' textColor={colors.icBlack}>
            Make sure to know what you are doing when entering custom slippage
            values.
          </Text>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

type AutoButtonProps = {
  isActive: boolean
  isDarkMode: boolean
  onClickAuto: () => void
}

const AutoButton = ({ isActive, isDarkMode, onClickAuto }: AutoButtonProps) => {
  const backgroundColor = isDarkMode ? colors.icWhite : colors.black
  const background = isActive ? backgroundColor : 'transparent'
  const activeColor = isDarkMode ? colors.black : colors.white
  const inactiveColor = isDarkMode ? colors.white : colors.black
  const color = isActive ? activeColor : inactiveColor
  return (
    <Button
      background={background}
      border='0'
      borderRadius={10}
      color={color}
      onClick={onClickAuto}
    >
      Auto
    </Button>
  )
}
