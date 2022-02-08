import React from 'react'

import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputProps,
  Text,
} from '@chakra-ui/react'

interface TokenInputProps extends InputProps {
  max: number | string
  symbol: string
  onSelectMax?: () => void
}

const TokenInput: React.FC<TokenInputProps> = ({
  max,
  symbol,
  onChange,
  onSelectMax,
  value,
}) => {
  return (
    <Box p={2}>
      <Text>
        {max.toLocaleString()} {symbol} Available
      </Text>
      <Flex pt={2}>
        <InputGroup>
          <Input
            placeholder={String(max) ?? '0'}
            onChange={onChange}
            value={value}
          />
        </InputGroup>
        <Button onClick={onSelectMax} ml={2} variant='secondary'>
          Max
        </Button>
      </Flex>
    </Box>
  )
}

export default TokenInput
