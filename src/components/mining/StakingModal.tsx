import { useCallback, useState } from 'react'

import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'

import TokenInput from 'components/TokenInput'
import { displayFromWei } from 'utils'

type StakeModalProps = {
  isOpen: boolean
  onClose: () => void
  onStake: (amount: string) => void
  stakeAbleBalance?: BigNumber
  stakeSymbol?: string
}

const StakingModal = ({
  isOpen,
  onClose,
  onStake,
  stakeAbleBalance,
  stakeSymbol,
}: StakeModalProps) => {
  const [val, setVal] = useState('')

  const fullTokenBalance = displayFromWei(stakeAbleBalance) ?? ''

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal]
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullTokenBalance)
  }, [fullTokenBalance, setVal])

  const handleStakeClick = useCallback(() => {
    onStake(val)
    onClose()
    setVal('')
  }, [onStake, onClose, val])

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          color='white'
          px={6}
          pb={0}
          fontSize='lg'
          fontWeight='medium'
        >
          Stake to earn rewards
        </ModalHeader>
        <ModalBody pt={0} px={4}>
          <TokenInput
            value={val}
            onSelectMax={handleSelectMax}
            onChange={handleChange}
            max={fullTokenBalance}
            symbol={`${stakeSymbol} Tokens`}
          />
          <Box>
            <Button
              margin={[2, 0, 0, 2]}
              disabled={!val || !Number(val)}
              onClick={handleStakeClick}
              variant={!val || !Number(val) ? 'secondary' : 'default'}
            >
              Stake
            </Button>
            <ModalCloseButton
              color='white'
              fontSize='sm'
              _hover={{
                color: 'whiteAlpha.700',
              }}
            />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default StakingModal
