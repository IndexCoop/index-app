import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
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
    <Dialog onClose={onClose} open={isOpen} className='relative z-50'>
      <DialogBackdrop className='bg-ic-black fixed inset-0 bg-opacity-60 backdrop-blur' />
      <div className='fixed inset-0 w-screen overflow-y-auto p-4'>
        <div className='flex min-h-full items-center justify-center'>
          <DialogPanel
            className={clsx(
              'border-ic-gray-100 dark:border-ic-gray-950 bg-ic-white text-ic-black dark:text-ic-white  mx-0 my-4 w-full max-w-sm overflow-scroll rounded-xl border-2 p-0 dark:bg-[#18181b]',
              isDarkMode ? 'dark' : '',
            )}
          >
            <DialogTitle className='text-ic-black dark:text-ic-white px-6 py-4 text-xl font-semibold'>
              Select a token
            </DialogTitle>
            <div className='px-0 py-4'>
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
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
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
