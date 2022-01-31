import { useCallback, useMemo, useState } from 'react'

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

type StakeModalProps = {
  isOpen: boolean
  onClose: () => void
  onStake: (amount: string) => void
}

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18) => {
  return balance.div(BigNumber.from(10).pow(decimals)).toNumber().toFixed()
}

/**
 * TODO
 * - get token symbol and balance
 * - fix styles
 * - check all values
 */

const StakingModal = ({ isOpen, onClose, onStake }: StakeModalProps) => {
  const [val, setVal] = useState('')
  //   const { gmiBalance } = useBalances()

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(
      //   fromWei(BigNumber.from(41851906)),
      BigNumber.from(41851906),
      0
    )
  }, [])
  //   }, [gmiBalance])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal]
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  const handleStakeClick = useCallback(() => {
    onStake(val)
  }, [onStake, val])

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color='white' px={4} fontSize='lg' fontWeight='medium'>
          Stake
        </ModalHeader>
        <ModalBody pt={0} px={4}>
          <TokenInput
            value={val}
            onSelectMax={handleSelectMax}
            onChange={handleChange}
            max={fullBalance}
            symbol='GMI Tokens'
          />
          <Box>
            <ModalCloseButton
              color='white'
              fontSize='sm'
              _hover={{
                color: 'whiteAlpha.700',
              }}
            />
            <Button
              disabled={!val || !Number(val)}
              onClick={handleStakeClick}
              variant={!val || !Number(val) ? 'secondary' : 'default'}
            >
              Stake
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default StakingModal
