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

type SettingsProps = {
  isAuto: boolean
  isDarkMode: boolean
  onChangeSlippage: (slippage: number) => void
  onClickAuto: () => void
  slippage: number
}

export const Settings = (props: SettingsProps) => {
  const { isAuto, isDarkMode, slippage, onChangeSlippage, onClickAuto } = props

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
      <PopoverContent
        bg={'linear-gradient(187deg, #FCFFFF -184.07%, #F7F8F8 171.05%)'}
        border='1px solid'
        borderColor={colors.icGray1}
        borderRadius={24}
        boxShadow={
          '0.5px 1px 10px 0px rgba(44, 51, 51, 0.10), 2px 2px 1px 0px #FCFFFF inset, 0.5px 0.5px 2px 0px rgba(0, 0, 0, 0.15)'
        }
        p='8px'
      >
        <PopoverBody>
          <Text fontSize='md' fontWeight='500' textColor={colors.icGray3}>
            Slippage
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
