import { Flex } from '@chakra-ui/react'

import { colors } from '@/lib/styles/colors'
import { cn } from '@/lib/utils/tailwind'

export enum ToggleState {
  auto,
  custom,
}

type ToggleButtonProps = {
  label: string
  isDisabled: boolean
  selected: boolean
  onClick: () => void
}

const ToggleButton = (props: ToggleButtonProps) => (
  <Flex
    bg={props.selected ? colors.ic.gray[100] : colors.ic.white}
    borderRadius={'10px'}
    cursor={'pointer'}
    flex={1}
    justify={'center'}
    onClick={props.onClick}
    p={'10px 16px'}
  >
    <p
      className={cn(
        'text-sm font-medium',
        props.isDisabled ? 'text-ic-gray-100' : 'text-ic-gray-900',
      )}
    >
      {props.label}
    </p>
  </Flex>
)

type ToggleProps = {
  toggleState: ToggleState
  labelLeft: string
  labelRight: string
  isDisabled: boolean
  onClick: (toggleState: ToggleState) => void
}

export const Toggle = (props: ToggleProps) => (
  <Flex
    className='bg-ic-white'
    borderColor={colors.ic.gray[100]}
    borderRadius={'12px'}
    borderWidth={1}
    justify={'center'}
    p={'4px'}
  >
    <ToggleButton
      isDisabled={props.isDisabled && props.toggleState === ToggleState.custom}
      label={props.labelLeft}
      onClick={() => props.onClick(ToggleState.auto)}
      selected={props.toggleState === ToggleState.auto}
    />
    <ToggleButton
      isDisabled={props.isDisabled && props.toggleState === ToggleState.auto}
      label={props.labelRight}
      onClick={() => props.onClick(ToggleState.custom)}
      selected={props.toggleState === ToggleState.custom}
    />
  </Flex>
)
