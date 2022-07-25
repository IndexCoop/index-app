import { colors } from 'styles/colors'
import { useNetwork, useSwitchNetwork } from 'wagmi'

import { Select, useColorModeValue } from '@chakra-ui/react'

import { SUPPORTED_CHAINS } from 'constants/chains'

const NetworkSelector = () => {
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const chainId = chain?.id

  const backgroundColor = useColorModeValue(colors.black, colors.white)
  const textColor = useColorModeValue(colors.white, colors.black)

  return (
    <Select
      ml={[0, 0, 4, 4]}
      mt={[4, 4, 0, 0]}
      backgroundColor={backgroundColor}
      border='2px solid'
      borderColor={backgroundColor}
      borderRadius='8'
      color={textColor}
      fontSize='md'
      fontWeight='bold'
      minWidth='50px'
      w='130px'
      onChange={(event) => {
        const chainId = Number(event.target.value)
        switchNetwork?.(chainId)
      }}
      value={chainId}
    >
      {SUPPORTED_CHAINS.map((chain) => {
        return (
          <option key={chain.chainId} value={chain.chainId}>
            {chain.name}
          </option>
        )
      })}
    </Select>
  )
}
export default NetworkSelector
