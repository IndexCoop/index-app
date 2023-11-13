import { useMemo, useState } from 'react'
import { SettingsIcon } from '@chakra-ui/icons'
import {
  Flex,
  IconButton,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react'

import { colors } from '@/lib/styles/colors'

import { Toggle, ToggleState } from './toggle'
import { Warning } from './warning'

type SettingsProps = {
  isAuto: boolean
  isDarkMode: boolean
  onChangeSlippage: (slippage: number) => void
  onClickAuto: () => void
  slippage: number
}

export const Settings = (props: SettingsProps) => {
  const { isAuto, slippage, onChangeSlippage, onClickAuto } = props
  const [inputValue, setInputValue] = useState<string>('')

  const inputTextColor = useMemo(
    () => (parseFloat(inputValue) > 50 ? colors.icRed : colors.icGray4),
    [inputValue]
  )

  const lowSlippage = useMemo(() => slippage < 0.05, [slippage])

  const showWarning = useMemo(
    () => slippage < 0.05 || (slippage > 1.0 && slippage <= 50),
    [slippage]
  )

  const toggleState = useMemo(
    () => (isAuto ? ToggleState.auto : ToggleState.custom),
    [isAuto]
  )

  const onChangeInput = (value: string) => {
    setInputValue(value)
    let updatedSlippage = parseFloat(value)
    if (value === '') {
      onClickAuto()
      return
    }
    if (Number.isNaN(updatedSlippage)) return
    onChangeSlippage(updatedSlippage)
  }

  const onClickToggle = (toggleState: ToggleState) => {
    if (toggleState === ToggleState.auto) {
      setInputValue('')
      onClickAuto()
      return
    }
  }

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
        w='320px'
      >
        <PopoverBody>
          <Text fontSize='md' fontWeight='500' textColor={colors.icGray3}>
            Slippage
          </Text>
          <Flex align='center' my='4'>
            <Toggle toggleState={toggleState} onClick={onClickToggle} />
            <Flex
              align='center'
              borderColor={colors.icGray1}
              borderRadius={'12px'}
              borderWidth={1}
              h='50px'
              ml='10px'
              px='8px'
            >
              <Input
                fontSize='sm'
                fontWeight={500}
                placeholder={`${slippage}`}
                _placeholder={{ color: colors.icGray2 }}
                p='8px'
                pr='4px'
                textAlign='right'
                textColor={inputTextColor}
                type='number'
                variant='unstyled'
                value={inputValue}
                onChange={(event) => {
                  const value = event.target.value
                  onChangeInput(value)
                }}
              />
              <Text fontSize={'sm'} fontWeight={500} textColor={colors.icGray4}>
                %
              </Text>
            </Flex>
          </Flex>
          {showWarning && <Warning lowSlippage={lowSlippage} />}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
