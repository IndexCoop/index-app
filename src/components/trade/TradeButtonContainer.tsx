import { useEffect, useState } from 'react'

import { useICColorMode } from 'styles/colors'

import { Flex } from '@chakra-ui/react'

import FlashbotsRpcMessage from 'components/trade/FlashbotsRpcMessage'
import { Token } from 'constants/tokens'
import { useNetwork } from 'hooks/useNetwork'
import { useProtection } from 'providers/Protection'

import { ContractExecutionView } from './ContractExecutionView'
import { ProtectionWarning } from './ProtectionWarning'
import { TradeButton } from './TradeButton'

type TradeButtonContainerProps = {
  children?: JSX.Element
  indexToken: Token
  inputOutputToken: Token
  buttonLabel: string
  isButtonDisabled: boolean
  isLoading: boolean
  onClickTradeButton: () => void
  contractAddress: string | null
  contractExplorerUrl: string | null
}

export const TradeButtonContainer = ({
  children,
  indexToken,
  inputOutputToken,
  buttonLabel,
  isButtonDisabled,
  isLoading,
  onClickTradeButton,
  contractAddress,
  contractExplorerUrl,
}: TradeButtonContainerProps) => {
  const { isDarkMode } = useICColorMode()
  const { isMainnet } = useNetwork()
  const protection = useProtection()

  // Does user need protecting from productive assets?
  const [requiresProtection, setRequiresProtection] = useState(false)
  useEffect(() => {
    if (
      protection.isProtectable &&
      (indexToken.isDangerous || inputOutputToken.isDangerous)
    ) {
      setRequiresProtection(true)
    } else {
      setRequiresProtection(false)
    }
  }, [indexToken, inputOutputToken, protection])

  return (
    <Flex direction='column'>
      {children}
      {requiresProtection && <ProtectionWarning isDarkMode={isDarkMode} />}
      <Flex my='8px' justifyContent={'center'}>
        {isMainnet && <FlashbotsRpcMessage />}
      </Flex>
      {!requiresProtection && (
        <TradeButton
          label={buttonLabel}
          isDisabled={isButtonDisabled}
          isLoading={isLoading}
          onClick={onClickTradeButton}
        />
      )}
      {contractAddress && contractExplorerUrl && (
        <ContractExecutionView
          blockExplorerUrl={contractExplorerUrl}
          contractAddress={contractAddress}
          name=''
        />
      )}
    </Flex>
  )
}
