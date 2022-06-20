import { colors } from 'styles/colors'

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
  isDarkMode: boolean
}

export const QuickTradeSettingsPopover = ({ isDarkMode }: PopoverProps) => {
  const autoIsActive = true
  const backgroundColor = isDarkMode ? colors.background : colors.white
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
          <Text fontSize='md' fontWeight='700'>
            Slippage Settings
          </Text>
          <Flex align='center' my='4'>
            <AutoButton isActive={autoIsActive} isDarkMode={isDarkMode} />
            <Flex
              align='center'
              border='1px solid gray'
              borderRadius={10}
              ml='8px'
              px='8px'
            >
              <Input
                fontSize='md'
                p='8px'
                pr='4px'
                textAlign='right'
                type='number'
                variant='unstyled'
                value={'0.5'}
                // onChange={(event) => onChangeInput(event.target.value)}
              />
              <Text>%</Text>
            </Flex>
          </Flex>
          <Text fontSize='sm' fontWeight='500'>
            Make sure to know what you're doing when entering custom slippage
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
}

const AutoButton = ({ isActive, isDarkMode }: AutoButtonProps) => {
  const backgroundColor = isDarkMode ? colors.white : colors.background
  const background = isActive ? backgroundColor : 'transparent'
  const activeColor = isDarkMode ? colors.black : colors.white
  const inactiveColor = isDarkMode ? colors.white : colors.black
  const color = isActive ? activeColor : inactiveColor
  return (
    <Button background={background} border='0' borderRadius={10} color={color}>
      Auto
    </Button>
  )
}
