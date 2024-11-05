import {
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import clsx from 'clsx'
import { BigNumber } from 'ethers'
import { useMemo } from 'react'

import { Token } from '@/constants/tokens'
import { useBalances } from '@/lib/hooks/use-balance'
import { useNetwork } from '@/lib/hooks/use-network'
import { formatAmountFromWei, isSameAddress } from '@/lib/utils'

type SelectTokenModalProps = {
  address?: string
  isOpen: boolean
  isDarkMode?: boolean
  showBalances?: boolean
  tokens: Token[]
  onClose: () => void
  onSelectedToken: (tokenSymbol: string) => void
}

export const SelectTokenModal = (props: SelectTokenModalProps) => {
  const { isOpen, onClose, onSelectedToken, tokens } = props
  const { chainId } = useNetwork()
  const isDarkMode = props.isDarkMode ?? false
  const showBalances = props.showBalances ?? true
  const tokenAddresses = useMemo(
    () =>
      tokens.map(
        (token) =>
          getTokenByChainAndSymbol(chainId, token.symbol)?.address ?? '',
      ),
    [chainId, tokens],
  )

  const { balances } = useBalances(props.address, tokenAddresses)
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered scrollBehavior='inside'>
      <ModalOverlay className='bg-ic-black bg-opacity-60 backdrop-blur' />
      <ModalContent
        className={clsx(
          'border-ic-gray-100 dark:border-ic-gray-950 bg-ic-white text-ic-black dark:text-ic-white  mx-0 my-4 max-h-[50%] rounded-xl border-2 p-0 dark:bg-[#1C2C2E]',
          isDarkMode ? 'dark' : '',
        )}
      >
        <ModalHeader>Select a token</ModalHeader>
        <ModalCloseButton />
        <ModalBody className='px-0 py-4'>
          {showBalances && (
            <div className='flex w-full justify-end pr-4'>
              <span className='text-sm font-medium'>Quantity Owned</span>
            </div>
          )}
          {tokens.length > 0 &&
            tokens.map((token) => {
              const tokenBalance = balances.find((bal) =>
                isSameAddress(
                  bal.token,
                  getTokenByChainAndSymbol(chainId, token.symbol)?.address ??
                    '',
                ),
              )
              const balance = BigNumber.from(
                tokenBalance?.value.toString() ?? '0',
              )
              const balanceDisplay = formatAmountFromWei(
                balance.toBigInt(),
                token.decimals,
                3,
              )
              return (
                <TokenItem
                  balance={showBalances ? balanceDisplay : ''}
                  key={token.symbol}
                  extraTitle={undefined}
                  item={token}
                  onClick={() => onSelectedToken(token.symbol)}
                />
              )
            })}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

type TokenItemProps = {
  balance: string
  extraTitle?: string
  item: Token
  onClick: (tokenSymbol: string) => void
}

const TokenItem = ({ balance, extraTitle, item, onClick }: TokenItemProps) => {
  return (
    <div
      className='text-ic-black dark:text-ic-white h-15 hover:bg-ic-gray-100 dark:hover:bg-ic-gray-900 my-1 flex cursor-pointer items-center justify-between px-4 py-2 text-sm font-medium'
      onClick={() => onClick(item.symbol)}
    >
      <div className='flex items-center'>
        <Image alt={`${item.symbol} logo`} src={item.image} w='40px' h='40px' />
        <div className='ml-4 flex flex-col'>
          <div className='flex align-baseline'>
            <span>{item.symbol}</span>
            {extraTitle && (
              <div className='text-ic-blue-500 ml-[2px]'>{extraTitle}</div>
            )}
          </div>
          <span className='dark:text-ic-gray-300'>{item.name}</span>
        </div>
      </div>
      <div className='ml-4 flex flex-col justify-end'>
        <span className='text-md font-bold'>{balance}</span>
      </div>
    </div>
  )
}
