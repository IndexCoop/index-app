import React from 'react'
import { Flex, Text } from '@chakra-ui/react'

import { colors } from '@/lib/styles/colors'

export enum ToggleState {
  auto,
  custom,
}

type ToggleButtonProps = {
  label: string
  selected: boolean
  onClick: () => void
}

const ToggleButton = (props: ToggleButtonProps) => (
  <Flex
    bg={props.selected ? colors.icGray1 : colors.icWhite}
    borderRadius={'10px'}
    cursor={'pointer'}
    onClick={props.onClick}
    p={'10px 16px'}
  >
    <Text fontSize={'sm'} fontWeight={500} textColor={colors.icGray4}>
      {props.label}
    </Text>
  </Flex>
)

type ToggleProps = {
  toggleState: ToggleState
  onClick: (toggleState: ToggleState) => void
}

export const Toggle = (props: ToggleProps) => (
  <Flex
    bg={colors.icWhite}
    borderColor={colors.icGray1}
    borderRadius={'12px'}
    borderWidth={1}
    p={'4px'}
  >
    <ToggleButton
      label={'Auto'}
      onClick={() => props.onClick(ToggleState.auto)}
      selected={props.toggleState === ToggleState.auto}
    />
    <ToggleButton
      label={'Custom'}
      onClick={() => props.onClick(ToggleState.custom)}
      selected={props.toggleState === ToggleState.custom}
    />
  </Flex>
)
