import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import clsx from 'clsx'
import Image from 'next/image'
import { useMemo } from 'react'
import { arbitrum, base } from 'viem/chains'

import { Token } from '@/constants/tokens'
import { useBalances } from '@/lib/hooks/use-balance'
import { useNetwork } from '@/lib/hooks/use-network'
import { formatAmountFromWei, isSameAddress } from '@/lib/utils'
import { getAddressForToken } from '@/lib/utils/tokens'

type SelectTokenModalProps = {
  address?: string
  isOpen: boolean
  isDarkMode?: boolean
  showBalances?: boolean
  showNetworks?: boolean
  tokens: Token[]
  onClose: () => void
  onSelectedToken: (tokenSymbol: string, chainId: number) => void
}

export const SelectTokenModal = (props: SelectTokenModalProps) => {
  const { isOpen, onClose, onSelectedToken, tokens } = props
  const { chainId } = useNetwork()
  const isDarkMode = props.isDarkMode ?? false
  const showBalances = props.showBalances ?? true
  const tokenAddresses = useMemo(
    () =>
      tokens.map((token) => getAddressForToken(token.symbol, chainId) ?? ''),
    [chainId, tokens],
  )

  const { balances } = useBalances(props.address, tokenAddresses)
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered scrollBehavior='inside'>
      <ModalOverlay className='bg-ic-black bg-opacity-60 backdrop-blur' />
      <ModalContent
        className={clsx(
          'border-ic-gray-100 bg-ic-white text-ic-black dark:text-ic-white mx-0  my-4 max-h-[50%] rounded-xl border-2 p-0 dark:border-white/15 dark:bg-zinc-900',
          isDarkMode ? 'dark' : '',
        )}
      >
        <ModalHeader className='text-ic-black dark:text-ic-white'>
          Select a token
        </ModalHeader>
        <ModalCloseButton className='text-ic-black dark:text-ic-white' />
        <ModalBody className='px-0 py-4'>
          {showBalances && (
            <div className='flex w-full justify-end pr-4'>
              <span className='text-ic-black dark:text-ic-white text-sm font-medium'>
                Quantity Owned
              </span>
            </div>
          )}
          {tokens.length > 0 &&
            tokens.map((token) => {
              const tokenBalance = balances.find((bal) =>
                isSameAddress(
                  bal.token,
                  getAddressForToken(token.symbol, chainId) ?? '',
                ),
              )
              const balanceDisplay = formatAmountFromWei(
                tokenBalance?.value ?? BigInt(0),
                token.decimals,
                3,
              )
              return (
                <TokenItem
                  balance={showBalances ? balanceDisplay : ''}
                  key={token.symbol}
                  extraTitle={undefined}
                  item={token}
                  showNetwork={props.showNetworks}
                  onClick={() =>
                    onSelectedToken(token.symbol, token.chainId ?? 1)
                  }
                />
              )
            })}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

type TokenItemProps = {
  item: Token
  balance: string
  extraTitle?: string
  showNetwork?: boolean
  onClick: (tokenSymbol: string) => void
}

const TokenItem = ({
  balance,
  extraTitle,
  item,
  onClick,
  showNetwork,
}: TokenItemProps) => {
  const networkAsset =
    showNetwork === true ? getAssetForChain(item.chainId ?? 1) : null
  return (
    <div
      className='text-ic-black dark:text-ic-white h-15 hover:bg-ic-gray-100 dark:hover:bg-ic-gray-900 my-1 flex cursor-pointer items-center justify-between px-4 py-2 text-sm font-medium'
      onClick={() => onClick(item.symbol)}
    >
      <div className='flex items-center'>
        <div className='relative inline-block h-11 w-11'>
          <Image
            alt={`${item.symbol} logo`}
            src={item.image}
            width={40}
            height={40}
          />
          {networkAsset && (
            <div className='bg-ic-gray-100 absolute bottom-0 right-0 h-5 w-5 rounded-full'>
              <Image
                alt={`${item.symbol} logo`}
                src={networkAsset}
                width={20}
                height={20}
              />
            </div>
          )}
        </div>
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

function getAssetForChain(chainId: number): string | null {
  switch (chainId) {
    case arbitrum.id:
      return '/assets/arbitrum-network-logo.svg'
    case base.id:
      return '/assets/base-network-icon.svg'
    default:
      // Return null by default to indicate ethereum and not show asset
      return null
  }
}
